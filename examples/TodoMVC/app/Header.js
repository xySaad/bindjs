import html from "../../../src/html/index.js";
import { addTodo } from "./context/todos.js";
const { input, h1, header } = html;

const keyEnter = (e) => {
  if (e.key === "Enter") {
    addTodo(e.target.value);
    e.target.value = "";
  }
};

export const Header = () => {
  return header({ class: "header" }).add(
    h1({ textContent: "todos" }),
    input({
      onkeyup: keyEnter,
      type: "text",
      class: "new-todo",
      autofocus: true,
      autocomplete: "off",
      placeholder: "What needs to be done?",
    })
  );
};
