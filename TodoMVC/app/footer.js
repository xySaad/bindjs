import html, { bindAs, A, router } from "rbind";
import { clearAll, todoList } from "./context/todos.js";

const { footer, li, span, ul, button } = html;

export const Footer = () => {
  const active = bindAs(todoList, "filter", (i) => !i.checked);

  return footer({ class: "footer", "date-testid": "footer" }).add(
    span({
      class: "todo-count",
      textContent: ($) =>
        `${$(active).length} ${
          active.value.length === 1 ? "item" : "items"
        } left!`,
    }),
    ul({ class: "filters", "data-testid": "footer-navigaion" }).add(
      li().add(A(($) => $(router.path) === "/" && "selected", "/", "All")),
      li().add(
        A(
          ($) => $(router.path) === "/active" && "selected",
          "/active",
          "Active"
        )
      ),
      li().add(
        A(
          ($) => $(router.path) === "/completed" && "selected",
          "/completed",
          "Completed"
        )
      )
    ),
    button({
      class: "clear-completed",
      textContent: "Clear completed",
      onclick: clearAll,
    })
  );
};
