import { button, div } from "./src/native.js";
import { ref } from "./src/state.js";

const App = () => {
    const count = ref(0);
    const counterDiv = div({
    className: "counter",
    textContent: count,
  });
    const RemoveItem = () => {
        console.log(counterDiv._refTrigger);
        
        count.destroy(counterDiv._refTrigger); // Clean up
    counterDiv.remove();  
    }
    return div({
        className: "parent",
        textContent: "Hello World",
    }).add(
        counterDiv,
        div({
            className: "counter",
            textContent: count,
        }),
        button({
            textContent: "increment",
            onclick: () => count.value++,
        }), button({
            textContent: "remove",
            onclick: RemoveItem,
        }), div({
            className: "counter",
            textContent: count,
        }),
    );
};

document.querySelector("body").append(App());
