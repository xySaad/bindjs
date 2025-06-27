import html, { state } from "../src/index.js";
import { todosInView } from "./context/todos.js";
const { div, h1, header, input, label } = html;
export const Header = () => {
  const value = state("");

  return header({ className: "header", "date-testid": "header" }).add(
    h1({ textContent: "todos" }),
    div({ className: "input-container" }).add(
      input({
        autofocus: true,
        className: "new-todo",
        id: "todo-input",
        type: "text",
        "data-testid": "text-input",
        placeholder: "What needs to be done?",
        is: { value },
        onkeyup: (e) => {
          if (e.key == "Enter" && value.value.trim().length >1) {
            todosInView.push({ value: value.value, checked: state(false) });

            value.value = "";
          }
        },
      }),
      label({
        className: "visually-hidden",
        for: "todo-input",
        textContent: "New Todo Input",
      })
    )
  );
};
