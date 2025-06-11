import { If } from "../../../../src/core/conditional.js";
import htmlElements from "../../src/html/index.js";
import { toggleAll } from "../context/todos.js";
import { TodoItem } from "./TodoItem.js";

const { div, ul, input, label, main } = htmlElements;

export const Main = (filtred) => {
  return main({ className: "main" }).add(
    If(
      filtred.len(),
      div({ class: "toggle-all-container" }).add(
        input({
          class: "toggle-all",
          type: "checkbox",
          id: "toggle-all-input",
          checked: filtred.every((todo) => todo.completed),
          onchange: (e) => toggleAll(e.target.checked),
        }),
        label({
          class: "toggle-all-label",
          htmlFor: "toggle-all-input",
          textContent: "Toggle All Input",
        })
      )
    ),
    ul({ class: "todo-list" }).add(filtred.map(TodoItem))
  );
};
