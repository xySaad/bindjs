# bindjs - a library that shouldn't exist
### Introduction
bindjs is a lightweight library for building reactive websites, featuring a built-in router, image/SVG caching, and a state management mechanism.

### Usage
### creating elements:
```ts
import {ce} from "bindjs/native"
ce(<tagName>, <attributes>)
```
#### or
```ts
import html from "bindjs/native"
const { div } = html

div(<className>, <textContent>, <attributes>)
```
### example:
```js
import html, {query} from "bindjs/native"
const { div } = html

const handleClick = ()=> alert("hello world")
query("body").append(
    div("randomClass", "Halo", {onclick: handleClick}).add(
        div("child", "halo again"),
        div("child 2", "halo again")
    )
)
```
📘 [BindJS Journey](./docs/BINDJS-JOURNEY.md)

### Conditional Rendering

The `If` function provides conditional rendering based on reactive values, while `IfElse` provides a more complete conditional rendering solution.

#### Basic Conditional Rendering

```javascript
import { If } from './src/core/conditional.js';

const showContent = useReference(false);
const content = html.div({ textContent: 'Conditional content' });

// Element will be shown/hidden based on showContent value
const conditionalElement = If(showContent, content);

// Toggle visibility
showContent(true);  // Shows content
showContent(false); // Hides content
```

#### If-Else Conditional Rendering

```javascript
import { IfElse } from './src/core/conditional.js';

const isLoggedIn = useReference(false);

const authContent = IfElse(
  isLoggedIn,
  // When true: show dashboard
  html.div({ class: 'dashboard' }).add(
    html.h2({ textContent: 'Welcome back!' }),
    html.button({ textContent: 'Logout', onclick: () => isLoggedIn(false) })
  ),
  // When false: show login form
  html.div({ class: 'login-form' }).add(
    html.h2({ textContent: 'Please login' }),
    html.button({ textContent: 'Login', onclick: () => isLoggedIn(true) })
  )
);
```

#### Advanced Conditional Rendering

```javascript
import { When, toggle } from './src/core/conditional.js';

// Toggle between two states
const [toggleMode, switchContent, currentMode] = toggle('light', 'dark');

const themeContent = switchContent(
  html.div({ textContent: 'Light theme' }),
  html.div({ textContent: 'Dark theme' })
);

// Switch modes
toggleMode(); // Switches between light/dark
```

#### Complex Conditionals with When

```javascript
import { When } from './src/core/conditional.js';

const user = useReference({ role: 'guest', isActive: false });

const userInterface = When((watch) => {
  const u = watch(user);
  
  if (u.role === 'admin' && u.isActive) {
    return html.div({ class: 'admin-panel' }).add(
      html.h2({ textContent: 'Admin Dashboard' }),
      html.button({ textContent: 'Manage Users' })
    );
  } else if (u.role === 'user' && u.isActive) {
    return html.div({ class: 'user-panel' }).add(
      html.h2({ textContent: 'User Dashboard' }),
      html.button({ textContent: 'View Profile' })
    );
  } else {
    return html.div({ class: 'access-denied' }).add(
      html.h2({ textContent: 'Access Denied' }),
      html.p({ textContent: 'Please contact an administrator' })
    );
  }
});
```
