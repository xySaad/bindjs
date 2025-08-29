BindJS in a lightweight JavaScript framework that uses data binding and fine-grained reactivity for state managment, custom routing system, and conditional rendrening...
It's main goal is to let the user write less code, without the cost of performance.

# Installation:

```sh
npx rbind my-app
cd my-app
npm i
```

And to start it in dev mode:

```sh
npm run dev
```

# Usage:

## App mounting:

```js
import { router } from "rbind";
router.setup({ "/": App, "/login": Login }); // mount App component to the path "/" and Login to "/login"
```

## Elements Creation:

```js
import html from "rbind";
const { div } = html;
div({ textContent: "Hello World", onclick: () => console.log("Clicked") });
// You can replace "div" by any html element
```

#### Nested Elements:

```js
import html from "rbind";
const { div, p } = html;
div({ class: "Container" }).add(p({ textContent: "Hello World" }));
```

## State Management

#### Setting and Getting value using state:

```js
import { state } from "rbind";
const counter = state(0); // 0 here is the default value
console.log(counter.value); // get the state value
counter.value++; // augment the state value
```

#### State management in DOM

```js
import {state},html from "rbind";
const {div} = html
const counter = state(0);
function App() {
  return div({
    textContent: (w)=>`Counter ${w(counter)}`,
    onclick: () => counter.value++,
  });
}
```

## Conditional Rendreing

Conditional rendering is used by passing a function that takes a Watcher and a Condition.

```js
(w, c) => c(() => w(todoList).length > 0) && Footer();
```

Here the `w` is a function that takes a state to watch for changes in, in this example we watch for changes in the length of todoList.
The `c` is a function that takes a condition and is used for optimization.

#### Watching order:

If the length or any other watched property has changed, we resolve the condition, then if the condition has changed we re-render the component in this case the '`Footer`'.

### Atrributes conditional rendering:

```js
import {state}, html from "rbind";
const { div } = html;
const isActive = state(false);

div({
  textContent: "Click me!",
  className: (w) => (w(isActive) ? "active" : "inactive"),
  onclick: () => (isActive.value = !isActive.value),
});
// The className will be "active" when isActive is true, otherwise "inactive"
```

### List Rendering

```js
import { list } from "rbind";
const nums = list([1, 2]);

nums.push(3); // list is now [1, 2, 3]
nums.remove(2); // list is now [1, 2] remove the given index from the list
```

## Creating a List

```js
import { list } from "rbind";
const todos = list([
  { title: "Task 1", checked: false },
  { title: "Task 2", checked: true },
]);
```

## Mapping to the DOM

```js
import html from "rbind";
const { ul, li } = html;

ul().add(
  todos.map((item) =>
    li({
      textContent: item.title,
      className: () => (item.checked ? "completed" : ""),
    })
  )
);
```

## Filtering a List

```js
const completed = todos.filter((t) => t.checked); // return a filtred list (completed) computed from todos
completed.refine((t) => t.checked); // re-compute the filtered list with the new condition
```

## Mutating the List

```js
todos.push({ title: "Task 3", checked: false });
todos.remove(0); // removes the first item
todos.purge((item) => !item.checked); // clears the unchecked items
```

> [xySaad](https://github.com/xySaad)

> [madaghaxx](https://github.com/madaghaxx)

> [fahdaguenouz](https://github.com/fahdaguenouz)
