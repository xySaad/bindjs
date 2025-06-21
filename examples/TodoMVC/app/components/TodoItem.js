import html, { frag, If, useReference } from "../../src/index.js";
import { deleteTodo, todos, todoType } from "../context/todos.js";
const { li, div, input, label, button } = html;

/**
 * @param {todoType} todo
 * @param {number} index
 */
export const TodoItem = (todo) => {
  const editing = useReference(false, (v) => (v ? "editing" : ""));
  const todoText = useReference(todo.title);

  const keyEnter = (e) => {
    const text = e.target.value;
    if (e.key === "Enter") {
      editing(false);
      if (text.trim().length === 0) deleteTodo(todo);
      else {
        todo.title = text;
        todoText(text);
        editing(false);
      }
    }
  };

  return li({ class: [todo.completed && "completed", editing] }).add(
    frag(
      div({ class: "view" }).add(
        input({
          type: "checkbox",
          class: "toggle",
          checked: todo.completed,
          onchange: (e) => {
            todo.completed = e.target.checked;
            todos((prev) => prev);
          },
        }),
        label({ textContent: todoText, ondblclick: () => editing(true) }),
        button({
          class: "destroy",
          onclick: () => deleteTodo(todo),
        })
      ),
      If(
        editing,
        input({
          value: todoText,
          id: "edit-todo-input",
          type: "text",
          class: "edit",
          onkeyup: keyEnter,
        })
      )
    )
  );
};
