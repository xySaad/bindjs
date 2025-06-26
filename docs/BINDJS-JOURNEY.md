# BindJS Journey

## Introduction

I always found it was redundant: creating elements using `document.createElement(tag)`, then setting the `textContent`, then `className`, and maybe some other attributes. Now you have the element — what’s next? Appending it?

Now you’ve just built a layout. But it doesn’t stop there. You still need to update these elements; change `textContent`, toggle class names, reorder them in the DOM, or remove them entirely.

The code keeps growing and maintaining it becomes harder. Sure, you can split things into functions, but what about referencing other elements across scopes? You’ll likely end up falling back to `querySelector`, and now the code’s getting even more bloated.

## Reduce Written Code

So, I thought: _why not make wrappers for the functions I use the most?_

### Base wrapper:

```jsx
export const createBindElement = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  element.className = className ?? "";
  element.textContent = textContent ?? "";
  return element;
};
```

### Since I mostly use `<div>`:

```jsx
export const div = (className, textContent) =>
  createBindElement("div", className, textContent);
```

### And an anchor (`<a>`) helper:

```jsx
export const a = (href, child) => {
  const aElement = createBindElement("a");
  aElement.href = href;
  aElement.append(child);
  return aElement;
};
```

---

### Example usage:

```jsx
const parent = div("parent");
parent.append(
  div("some class", "hello world!"),
  a("#", div("still class", "click!"))
);
document.querySelector("app").append(parent);
```

This is equivalent to the verbose version:

```jsx
const parent = document.createElement("div");
parent.className = "parent";
const someDiv = document.createElement("div");
someDiv.className = "some class";
someDiv.textContent = "hello world!";
const a = document.createElement("a");
a.href = "#";
const clickDiv = document.createElement("div");
clickDiv.className = "still class";
clickDiv.textContent = "click!";
a.append(clickDiv);
parent.append(someDiv, a);
document.querySelector("app").append(parent);
```

---

## Chained Elements

**Inspired by**: [Chained Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#chained_promises)

Even with wrappers, It still not clean enough. Why should I assign `parent` to a variable if I’m not reusing it or attaching events?

### Instead of this:

```jsx
const app = document.querySelector("app");
const container = div("container");

const header = div("header");
header.append(div("title", "Welcome"), div("desc", "This is a test."));

const actions = div("actions");
actions.append(button("btn", "Click me"));

container.append(header, actions);
app.append(container);
```

### I want this:

```jsx
const app = document.querySelector("app");
app.append(
  div("container").append(
    div("header").append(
      div("title", "Welcome"),
      div("desc", "This is a test.")
    ),
    div("actions").append(button("btn", "Click me"))
  )
);
```

The issue? `Element.append()` returns `undefined`, so you can’t chain it. The fix is to add a custom `.add()` method to elements created through `createBindElement`:

---

### Making .append() Chainable with .add()

```diff
export const createBindElement = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  element.className = className ?? "";
  element.textContent = textContent ?? "";
+  element.add = function (...children) {
+    this.append(...children);
+    return this;
+  };
  return element;
};
```

Now, you can create nested, chainable elements. This makes building UI declarative and readable without needing JSX or frameworks.
Here’s a working [example app](/examples/coffeeList) that demonstrates the approach.

> Note: elements are mounted from bottom to top, meaning the parent element won't be available on DOM until the last child is resolved, I will explain a way to fix this later in this documentation.

---

## Reactivity

First we will update the `createBindElement` function for better flexebilty

```js
export const createBindElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  element.add = asyncAppend;
  if (key in element) {
    // attaching events and element properties
    element[key] = value;
  } else {
    // normal attributes
    element.setAttribute(key, value);
  }
  return element;
};
```

See line 3 in [/src/html/native.js](/src/html/native.js) for the implementation of `asyncAppend`

#### Binding variables to DOM elements

There are several ways to bind a certain variable to an element or an attribute, ...
