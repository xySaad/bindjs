import html, { bind, state } from "rbind";
import { todosInView } from "../context/todos.js";

const { button, div, input, label, li } = html;
export const Task = (item, idx, ctx) => {
  // TODO: support compiled syntax (slighly better runtime performance)
  // @bind checked = item.checked
  // @bind checked from item

  ctx.checked = bind(item, "checked");

  const isWritable = state(false);

  return li({
    className: {
      completed: ctx.checked,
    },
    "data-testid": "todo-item",
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
              value: item.value,
              keydown: {
                enter: (e) => {
                  const text = e.target.value;
                  if (text.trim().length > 1) {
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
              checked: ctx.checked,
              type: "checkbox",
              "data-testid": "todo-item-toggle",
              is: { checked: ctx.checked },
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
