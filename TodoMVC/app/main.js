import html, { bindAs } from "rbind";
import { Task } from "./components/TodoTask.js";
import {
  todosInView,
  getFilterFunc,
  todoList,
  toggleAll,
} from "./context/todos.js";
const { div, input, label, main, ul } = html;

const checkAllItems = () => {
  const checked = bindAs(todosInView, "every", (todo) => todo.completed);

  return div({ className: "toggle-all-container" }).add(
    input({
      className: "toggle-all",
      type: "checkbox",
      id: "toggle-all",
      "data-testid": "toggle-all",
      is: { checked },
      onclick: () => toggleAll(checked),
    }),
    label({
      className: "toggle-all-label",
      for: "toggle-all",
      textContent: "Toggle All Input",
    })
  );
};

export const Main = () => {
  const filter = getFilterFunc();
  return main({ className: "main", "data-testid": "main" }).add(
    (w, c) => c(() => w(todoList).length > 0) && checkAllItems(),
    ul({ className: "todo-list", "data-testid": "todo-list" }).bind(
      todosInView,
      (item, idx) => (filter(item) ? Task(item, idx) : "")
    )
  );
};
