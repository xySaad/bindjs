BindJS in a lightweight JavaScript framework built by [xySaad](https://github.com/xySaad) as a mini-framework project, It uses Data binding for state managment, custom routing system, and conditional rendrening...
It's main goal is to let the user write less code.

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

### App mounting:

```js
import { router } from "rbind";
router.SetRoute("/", App); // mount App component to the path "/"
```

### Elements Creation:

```js
import html from "rbind";
const { div } = html;
div({ textContent: "Hello World", onclick: () => console.log("Clicked") });
// You can replace "div" by any html element
```

### State Management

#### Setting and Getting value using state:

```js
import state from "rbind";
const counter = state(0); // 0 here is the default value
console.log(state.value); // get the state value
state.value++; // augment the state value
```

#### State management in DOM

```js
import state,html from "rbind";
const {div} = html
const counter = state(0);
function App() {
  return div({
    textContent: ["Counter:", counter], // use arrays instead of string literals
    onclick: () => counter.value++,
  });
}
```

### Conditional Rendreing

Conditional rendering is used by passing a function that takes a Watcher and a Condition.

```js
(w, c) => c(() => w(todoList).length > 0) && Footer();
```

Here the `w` is a function that takes a state to watch for changes in, in this example we watch for changes in the length of todoList.
The `c` is a function that takes a condition and is used for optimization.

##### Watching order:

If the length or any other watched property has changed, we resolve the condition, then if the condition has changed we re-render the component in this case the '`Footer`'.

# Contributors:

> [xySaad](https://github.com/xySaad)

> [madaghaxx](https://github.com/madaghaxx)

> [fahdaguenouz](https://github.com/fahdaguenouz)

> [Eli-Slim](https://github.com/Eli-Slim)
