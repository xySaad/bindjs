import html, { state } from "rbind";
import { Task } from "./components/TodoTask.js";
import { getFilterFunc, todoList, toggleAll } from "./context/todos.js";
const { div, input, label, main, ul } = html;

const checkAllItems = () => {
  const checked = state(false);
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

export const Main = (filtred) => {
  const filter = getFilterFunc();
  return main({ className: "main", "data-testid": "main" }).add(
    (w, c) => c(() => w(todoList).length > 0) && checkAllItems(),
    ul({ className: "todo-list", "data-testid": "todo-list" }).bind(
      filtred,
      (item, idx) => filter(item) && Task(filtred, item, idx)
    )
  );
};
