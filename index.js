import { button, createElement, div } from "./src/native.js";
import { newState } from "./src/state.js";

const App = () => {
  const count = newState(0);

  const display = div({
    className: "counter",
    textContent: count.value,
  });

  const handleCountChange = () => {
    display.textContent = count.getValue();
  };
  const AddIncream=()=>{
  count.setValue(count.value + 1)
}
  count.onCHange(handleCountChange)

  // setInterval(() => count.setValue(count.value + 1), 1000);

  return div({
    className: "parent",
    textContent: "Hello World",
  }).add(display, button({ textContent: "increment", onclick:AddIncream}));
};

document.querySelector("body").append(App());
