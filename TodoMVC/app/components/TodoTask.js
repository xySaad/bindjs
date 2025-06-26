import html, { bind, bindAs } from "rbind";

const { button, div, input, label, li } = html;
export const Task = (filtred, item, idx) => {
  // TODO: support compiled syntax (slighly better runtime performance)
  // @bind checked = item.checked
  // @bind checked from item

  const checked = bind(item, "checked");

  return li({
    className: checked.value ? "completed" : "",
    "data-testid": "todo-item",
    "data-chcked": bindAs(checked),
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
        onclick: () => filtred.remove(idx()),
      })
    )
  );
};
