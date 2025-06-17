import { button, div } from "./src/native.js";
import { ref } from "./src/state.js";

const App = () => {
  const count = ref(0);

  return div({
    className: "parent",
    textContent: "Hello World",
  }).add(
    div({
      className: "counter",
      textContent: count,
    }),
    button({
      textContent: "increment",
      onclick: () => count.value++,
    })
  );
};

document.querySelector("body").append(App());
