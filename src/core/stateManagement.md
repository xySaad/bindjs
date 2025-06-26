# State Management Documentation

## Overview

The State and List classes provide reactive state management . They implement an observer pattern where components automatically update when state changes, enabling declarative UI programming.

## How Reactive State Works

The system uses a **dependency registration** pattern:

1. **State Storage** - Values are stored internally with getter/setter access
2. **Change Detection** - Setters automatically trigger registered callbacks
3. **Automatic Updates** - UI components re-render when their dependencies change
4. **Proxy Wrapping** - Objects are wrapped in proxies to detect deep property changes

## State Class

The base reactive state container for single values.

### Constructor

```
constructor(defaultValue) {
    this.#value = defaultValue;
  }
```

**Purpose**: Creates a new reactive state instance with an initial value.

**Parameters**:
- `defaultValue` (any): The initial value for the state

**What it does**:
- Stores the initial value in a private `#value` field
- Initializes an empty dependencies array for observers

### value (getter/setter)

```
set value(newValue) {
    this.#value = newValue;
    this.trigger();
  }
get value() {
    return this.#value;
  }
```

**Purpose**: Provides controlled access to the state value with automatic change detection.

**Getter**: Returns the current stored value
**Setter**: Updates the value and triggers all registered dependencies

**What the setter does**:
- Updates the internal `#value`
- Calls `trigger()` to notify all observers

### register(callback)

```
#dependencies = [];
  register(callback) {
    this.#dependencies.push(callback);
  }
```

**Parameters**:
- `callback` (function): Function to call when state changes, receives new value as parameter

**Purpose**: Registers a callback to be executed whenever the state value changes.

**What it does**:
- Adds the callback to the internal `#dependencies` array
- The callback will receive the new value when triggered

### trigger()

```
 trigger() {
    for (const dep of this.#dependencies) dep(this.#value);
  }
```

**Purpose**: Manually triggers all registered callbacks with the current value.

**What it does**:
- Iterates through all registered dependencies
- Calls each callback function with the current `#value`

## List Class

Extends State to provide reactive array management with DOM binding capabilities.

### Constructor

```
constructor(defaultValue = []) {
    super(defaultValue);
    this.value.forEach((_, i) => this.#idx.push(ref(i)));
  }
```

**Purpose**: Creates a reactive list with optional initial items.

**Parameters**:
- `defaultValue` (array): Initial array items (defaults to empty array)

**What it does**:
- Calls parent State constructor with the array
- Creates index references for each initial item
- Initializes tracking arrays for parent node, component, and synced lists

### push(pushable, shouldProxy = true)

```
 push(pushable, shouldProxy = true) {
    const px = shouldProxy
      ? new Proxy(pushable, {
          get(target, prop) {
            return target[prop];
          },
          set: (target, prop, newValue) => {
            target[prop] = newValue;
            this.trigger();
            for (const { list: subList } of this.#synced) subList.trigger();
            return true;
          },
        })
      : pushable;

    for (const { list: subList, filter } of this.#synced) {
      if (!filter || filter(px)) subList.push(px, false);
    }
    const refIdx = ref(this.value.length);
    this.#idx.push(refIdx);
    if (this.#parentNode) {
      const elm = this.#component(px, refIdx);
      // use append instead of add to not trigger onAppend
      this.#parentNode.append(elm);
      elm.onAppend?.();
    }
    this.value.push(px);
    this.trigger();
  }
```

**Parameters**:
- `pushable` (any): Item to add to the list
- `shouldProxy` (boolean): Whether to wrap objects in reactive proxies (default: true)

**Purpose**: Adds new items to the list with automatic DOM updates and proxy wrapping.

**What it does**:
- Wraps objects in proxies to detect property changes (if shouldProxy is true)
- Propagates additions to any synced/derived lists
- Creates index reference for the new item
- If bound to DOM, creates and appends the component element
- Adds item to the internal array and triggers observers

### remove(index)

```
 remove(index) {
    for (const { list: subList } of this.#synced) {
      const itemToRemove = this.value[index];
      const indexToRemove = subList.value.indexOf(itemToRemove);
      subList.remove(indexToRemove);
    }
    this.value.splice(index, 1);
    this.#idx.splice(index, 1);
    console.log(index);
    
    this.#parentNode?.children[index].remove();
    for (let i = index; i < this.#idx.length; i++) {
      const idxRef = this.#idx[i];
      idxRef((prev) => prev - 1);
    }
    this.trigger();
  }
```

**Parameters**:
- `index` (number): Array index of item to remove

**Purpose**: Removes an item from the list and updates DOM accordingly.

**What it does**:
- Removes corresponding items from synced lists
- Removes item from internal array and index tracking
- Removes corresponding DOM element if bound
- Updates all subsequent index references
- Triggers change notifications

### derive(filter)

```
 derive(filter) {
    const derivedList = new List(this.value);
    derivedList.#synced.push({ list: this, filter });
    return derivedList;
  }
```

**Parameters**:
- `filter` (function): Optional function to determine which items to include

**Purpose**: Creates a derived list that stays synchronized with the parent list.

**What it does**:
- Creates a new List instance with current items
- Establishes a sync relationship with the parent list
- Returns the derived list that will automatically update when parent changes

### bind(parentNode, component)

```
bind(parentNode, component) {
    if (!(this instanceof List))
      throw new Error("this doesn't implement interface List");
    this.#parentNode = parentNode;
    this.#component = component;
    this.value.forEach((item, i) => {
      const child = component(item, this.#idx[i])
      parentNode.append(child);
      child.onAppend?.()
    });
  }
```

**Parameters**:
- `parentNode` (DOM Element): Container element for list items
- `component` (function): Function that creates DOM elements for each item

**Purpose**: Connects the list to DOM rendering, creating components for each item.

**What it does**:
- Stores references to parent node and component function
- Immediately renders existing items by calling component function
- Sets up automatic DOM updates for future list changes
- Calls `onAppend()` lifecycle method on each created component

## Helper Functions

### state(defaultValue)

```
const myState = state(initialValue);
```

**Purpose**: Factory function to create State instances.

### list(defaultValue)

```
const myList = list(initialArray);
```

**Purpose**: Factory function to create List instances.

## Usage Examples

### Basic State Usage

```
import { state } from './state.js';
import html from '../html/index.js';

const { div, input, p } = html;

// Create reactive state
const userName = state('');
const userAge = state(0);

// Create component that responds to state changes
const UserProfile = () => {
  return div().add(
    input({
      type: 'text',
      placeholder: 'Enter name',
      oninput: (e) => userName.value = e.target.value
    }),
    input({
      type: 'number',
      placeholder: 'Enter age',
      oninput: (e) => userAge.value = parseInt(e.target.value)
    }),
    // These will update automatically when state changes
    p({ 
      is: { textContent: userName },
      textContent: 'Name: '
    }),
    p({ 
      is: { textContent: userAge.register(age => `Age: ${age}`) }
    })
  );
};
```

### List with DOM Binding

```
import { list } from './state.js';
import html from '../html/index.js';

const { div, ul, li, input, button } = html;

//Create reactive list
const todoList = list([
  { id: 1, text: 'Learn framework', completed: false },
  { id: 2, text: 'Build app', completed: false }
]);

// Component for individual todo items
const TodoItem = (todo, indexRef) => {
  return li().add(
    input({
      type: 'checkbox',
      checked: todo.completed,
      onchange: (e) => todo.completed = e.target.checked
    }),
    div({ 
      textContent: todo.text,
      onclick: () => todoList.remove(indexRef.value)
    })
  );
};

// Main todo app component
const TodoApp = () => {
  const newTodoText = state('');
  
  return div().add(
    input({
      type: 'text',
      placeholder: 'Add new todo',
      is: { value: newTodoText },
      oninput: (e) => newTodoText.value = e.target.value
    }),
    button({
      textContent: 'Add Todo',
      onclick: () => {
        if (newTodoText.value.trim()) {
          todoList.push({
            id: Date.now(),
            text: newTodoText.value,
            completed: false
          });
          newTodoText.value = '';
        }
      }
    }),
    ul().bind(todoList, TodoItem)
  );
};
```

### Derived Lists and Filtering

```
import { list } from './state.js';

const allTodos = list([
  { text: 'Task 1', completed: true },
  { text: 'Task 2', completed: false },
  { text: 'Task 3', completed: false }
]);

// Create filtered views
const completedTodos = allTodos.derive(todo => todo.completed);
const pendingTodos = allTodos.derive(todo => !todo.completed);

// These derived lists automatically update when allTodos changes
console.log(completedTodos.value.length); // 1
console.log(pendingTodos.value.length);   // 2

// Adding to main list updates derived lists
allTodos.push({ text: 'Task 4', completed: true });
console.log(completedTodos.value.length); // 2
```

### Advanced State Management

```
import { state, list } from './state.js';

// Counter with multiple observers
const counter = state(0);

// Register multiple callbacks
counter.register(value => console.log(`Counter: ${value}`));
counter.register(value => {
  if (value > 10) console.log('Counter is high!');
});

// Object state with property watching
const user = state({
  name: 'John',
  email: 'john@example.com',
  preferences: { theme: 'dark' }
});

// Watch for user changes
user.register(newUser => {
  console.log('User updated:', newUser);
});

// Update triggers observers
user.value = { ...user.value, name: 'Jane' };
```
