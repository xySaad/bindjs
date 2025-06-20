import { div, h1, header, input, label } from "../../src/native.js";
import { ref } from "../../src/state.js";
import { todoList } from "./context/todos.js";

export const Header = () => {
  const value = ref("");

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
          if (e.key == "Enter" && value.value.trim().length != 0) {
            todoList.push({ value: value.value, checked: false });
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
