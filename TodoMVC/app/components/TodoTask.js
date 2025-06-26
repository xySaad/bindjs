import html, { bind, bindAs, state } from "../../src/index.js";
import { todosInView } from "../context/todos.js";

const { button, div, input, label, li } = html;
export const Task = (item, idx) => {
  // TODO: support compiled syntax (slighly better runtime performance)
  // @bind checked = item.checked
  // @bind checked from item

  const checked = bind(item, "checked");
  const isWritable = state(false);

  return li({
    className: checked.value ? "completed" : "",
    "data-testid": "todo-item",
    "data-chcked": bindAs(checked),
  }).add(
    div({ className: "view" }).add((w, c) =>
      c(() => w(isWritable))
        ? div({ class: "input-container" }).add(
          input({
            className: "new-todo",
            id: "todo-input",
            type: "text",
            "data-testid": "text-input",
            autoFocus: true,
            defaultValue: item.value,
            keydown: {
              enter: (e) => {
                const text = e.target.value;
                if (text.trim().length > 0) {
                  item.value = e.target.value;
                }
                isWritable.value = false;
              },
            },
            onblur: () => (isWritable.value = false),
          }),
          label({ class: "visually-hidden", htmlFor: "todo-input" })
        )
        : div().add(
          input({
            className: "toggle",
            checked,
            type: "checkbox",
            "data-testid": "todo-item-toggle",
            is: { checked },
          }),
          label({
            "data-testid": "todo-item-label",
            textContent: item.value,
            ondblclick: () => (isWritable.value = true),
          }),
          button({
            className: "destroy",
            "data-testid": "todo-item-button",
            onclick: () => todosInView.remove(idx()),
          })
        )
    )
  );
};
