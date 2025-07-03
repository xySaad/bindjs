import html, { bindAs, A, router } from "rbind";
import { clearAll, displayedTodos, todoList } from "./context/todos.js";

const { footer, li, span, ul, button } = html;

export const Footer = () => {
  const active = bindAs(todoList, "filter", (i) => !i.checked);

  return footer({ className: "footer", "date-testid": "footer" }).add(
    (w, c) => {
      return span({
        className: "todo-count",
        textContent: [
          bindAs(active, "length"),
          `${c(() => w(active).length === 1) ? "item" : "items"} left!`,
        ],
      });
    },
    ul({ className: "filters", "data-testid": "footer-navigaion" }).add(
      li().add(A({ selected: (w) => w(router.path) === "/" }, "/", "All")),
      li().add(
        A(
          { selected: (w) => w(router.path) === "/active" },
          "/active",
          "Active"
        )
      ),
      li().add(
        A(
          { selected: (w) => w(router.path) === "/completed" },
          "/completed",
          "Completed"
        )
      )
    ),
    button({
      className: "clear-completed",
      textContent: "Clear completed",
      onclick: clearAll,
    })
  );
};
