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
      li().add(A(router.path.value === "/" ? "selected" : "", "/", "All")),
      li().add(
        A(
          router.path.value === "/active" ? "selected" : "",
          "/active",
          "Active"
        )
      ),
      li().add(
        A(
          router.path.value === "/completed" ? "selected" : "",
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
