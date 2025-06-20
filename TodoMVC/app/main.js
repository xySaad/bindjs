import { div, input, label, main, ul } from "../../src/native.js";
import { ref } from "../../src/state.js";
import { Task } from "./components/TodoTask.js";
import { todoList } from "./context/todos.js";

const checkAllItems = () => {
  const checked = ref(false);
  checked.register(() => {
    todoList.value = todoList.value.map((t) => ({
      value: t.value,
      checked: checked.value,
    }));
  });
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
    checkAllItems(),
    ul({ className: "todo-list", "data-testid": "todo-list" }).bind(
      todoList,
      Task
    )
  );
};
