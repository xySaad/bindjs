# Router Class Documentation

## Overview

The Router class is a lightweight client-side routing solution for single-page applications. It provides declarative route handling with automatic DOM rendering and navigation management.

## How Routing Works

The router uses the browser's History API to manage navigation without page refreshes. It:

1. **Maps routes to handlers** - Each route path is associated with a callback function
2. **Listens for navigation** - Responds to browser URL changes and programmatic navigation
3. **Renders content dynamically** - Clears the body and renders the appropriate component
4. **Maintains state** - Tracks the current path and manages browser history

## Class Methods

### Constructor

```
 constructor() {
    this.routes = new Map();
    this.currentPath = location.pathname;
    window.addEventListener("DOMContentLoaded", () => {
      this.render();
    });
  }
```

**Purpose**: Initializes the router instance and sets up event listeners.

**What it does**:
- Creates an empty `Map` to store route definitions
- Sets `currentPath` to the browser's current pathname
- Adds a `DOMContentLoaded` event listener to render the initial route
- Automatically renders the current route when the page loads

### render()

```
 render() {
    let path = location.pathname;
    let callback = this.routes.get(path);

    if (!callback) {
      console.error("no callback for the route ", path);
      callback = () => div({ textContent: "404" });
      return;
    }
    document.body.innerHTML = "";
    const elm = callback()
    document.body.append(elm);
    elm.onAppend()
  }
```

**Purpose**: Renders the component associated with the current URL path.

**What it does**:
- Gets the current pathname from `location.pathname`
- Looks up the corresponding callback function in the routes Map
- If no route is found, logs an error and shows a 404 fallback
- Clears the document body completely
- Executes the route callback to get the component
- Appends the component to the document body
- Calls the component's `onAppend()` lifecycle method

### SetRoute(path, handler)

```
 SetRoute(path, handler) {
    this.routes.set(path, handler);
  }
```

**Parameters**:
- `path` (string): The URL path to match (e.g., "/home", "/about")
- `handler` (function): Callback function that returns a DOM element/component

**Purpose**: Registers a new route with its corresponding handler function.

**What it does**:
- Stores the path-handler pair in the internal routes Map
- The handler will be called when the user navigates to that path

### navigate(path)

```
navigate(path) {
    if (path != this.currentPath) {
      history.pushState({}, null, path);
      this.currentPath = location.pathname;
      this.render();
    }
  }
```

**Parameters**:
- `path` (string): The target path to navigate to

**Purpose**: Programmatically navigates to a different route.

**What it does**:
- Checks if the new path is different from the current path
- Uses `history.pushState()` to update the browser URL without page refresh
- Updates the internal `currentPath` property
- Calls `render()` to display the new route's content

## Usage Example

Here's a complete example showing how to use the Router class:


## Register Routes using SetRoute(path, handler)
```

import { router } from './router.js';
import html from '../html/index.js';
router.SetRoute("/", () => {
  const page = div({ textContent: "Welcome to Home Page" });
  return page;
});

router.SetRoute("/about", () => {
  const page = div({ textContent: "About Us" });
  return page;
});

```

## Navigate with router.navigate(path) 

```

const homeBtn = div({
  textContent: "Go Home",
  onclick: () => router.navigate("/"),
});

const aboutBtn = div({
  textContent: "Go to About",
  onclick: () => router.navigate("/about"),
});

document.body.append(homeBtn, aboutBtn);

```