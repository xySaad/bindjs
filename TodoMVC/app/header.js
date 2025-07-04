import html, { state } from "rbind";
import { todoList } from "./context/todos.js";

const { div, h1, header, input, label } = html;
export const Header = () => {
  const title = state("");

  return header({ class: "header", "date-testid": "header" }).add(
    h1({ textContent: "todos" }),
    div({ class: "input-container" }).add(
      input({
        autofocus: true,
        class: "new-todo",
        id: "todo-input",
        type: "text",
        "data-testid": "text-input",
        placeholder: "What needs to be done?",
        is: { value: title },
        onkeyup: (e) => {
          if (e.key == "Enter" && title.value.trim().length > 1) {
            todoList.push({ title: title.value, checked: false });
            title.value = "";
          }
        },
      }),
      label({
        class: "visually-hidden",
        for: "todo-input",
        textContent: "New Todo Input",
      })
    )
  );
};
