# BindJS Journey

## Introduction

I always found it was redundant: creating elements using `document.createElement(tag)`, then setting the `textContent`, then `className`, and maybe some other attributes. Now you have the element — what’s next? Appending it?

Now you’ve just built a layout. But it doesn’t stop there. You still need to update these elements; change `textContent`, toggle class names, reorder them in the DOM, or remove them entirely.

The code keeps growing and maintaining it becomes harder. Sure, you can split things into functions, but what about referencing other elements across scopes? You’ll likely end up falling back to `querySelector`, and now the code’s getting even more bloated.

## Reduce Written Code

So, I thought: *why not make wrappers for the functions I use the most?*

### Base wrapper:

```jsx
export const ce = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  element.className = className ?? "";
  element.textContent = textContent ?? "";
  return element;
};
```

### Since I mostly use `<div>`:

```jsx
export const div = (className, textContent) =>
  ce("div", className, textContent);
```

### And an anchor (`<a>`) helper:

```jsx
export const a = (href, child) => {
  const aElement = ce("a");
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
const parent = div("parent");
parent.append(...);
document.querySelector("app").append(parent);
```

### I want this:

```jsx
document.querySelector("app").append(
    div("parent").add(
      div("some class", "hello world!"),
      a("#", div("still class", "click!"))
    )
  );
```

The issue? `Element.append()` returns `undefined`, so you can’t chain it. The fix is to add a custom `.add()` method to elements created through `ce()`:

---

### Making .append() Chainable with .add()

```diff
export const ce = (tagName, className, textContent) => {
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

> 🔸 Now, you can create nested, chainable elements. This makes building UI declarative and readable without needing JSX or frameworks.
> 

Here’s a working [example app](https://github.com/xySaad/bindjs/blob/main/examples/cofeeList.html) that demonstrates the approach.

---

## Reactivity

First, we will …
