import html, { bindAs } from "rbind";
import { TestTask } from "./components/TodoTask.js";
import { displayedTodos, toggleAll } from "./context/todos.js";
const { div, input, label, main, ul } = html;

const checkAllItems = () => {
  const checked = bindAs(displayedTodos(), "every", (todo) => todo.checked);

  return div({ className: "toggle-all-container" }).add(
    input({
      className: "toggle-all",
      type: "checkbox",
      id: "toggle-all",
      "data-testid": "toggle-all",
      is: { checked },
      onclick: () => toggleAll(!checked.value),
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
    (w, c) => c(() => w(displayedTodos()).length > 0) && checkAllItems(),
    ul({ className: "todo-list", "data-testid": "todo-list" }).add(
      displayedTodos().map(TestTask)
    )
  );
};
