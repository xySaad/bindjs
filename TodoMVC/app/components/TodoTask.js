import { button, div, input, label, li } from "../../../src/native.js";
import { ref } from "../../../src/state.js";
import { todoList } from "../context/todos.js";

export const Task = (item, i) => {
  const checked = ref(todoList.value[i].checked);

  return li({
    className: checked.value ? "completed" : "",
    "data-testid": "todo-item",
  }).add(
    div({ className: "view" }).add(
      input({
        className: "toggle",
        checked,
        type: "checkbox",
        "data-testid": "todo-item-toggle",
        is: { checked },
      }),
      label({ "data-testid": "todo-item-label", textContent: item.value }),
      button({
        className: "destroy",
        "data-testid": "todo-item-button",
        onclick: () => todoList.remove(i),
      })
    )
  );
};
