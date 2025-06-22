import html, { ref } from "../src/index.js";
import { Task } from "./components/TodoTask.js";
import { todoList, toggleAll } from "./context/todos.js";
const { div, input, label, main, ul } = html;

const checkAllItems = () => {
  const checked = ref(false);
  checked.register(toggleAll);

  return div({ className: "toggle-all-container" }).add(
    input({
      className: "toggle-all",
      type: "checkbox",
      id: "toggle-all",
      "data-testid": "toggle-all",
      is: { checked },
    }),
    label({
      className: "toggle-all-label",
      for: "toggle-all",
      textContent: "Toggle All Input",
    })
  );
};

export const Main = () => {
  return main({ className: "main", "data-testid": "main" }).add(
    (w, c) => c(() => w(todoList).length > 0) && checkAllItems(),
    ul({ className: "todo-list", "data-testid": "todo-list" }).bind(
      todoList,
      Task
    )
  );
};
