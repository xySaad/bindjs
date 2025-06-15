import htmlElements from "../../src/html/index.js";
import { frag } from "../../src/html/custom/fragment.js";
import { Link } from "../../../src/router/Link.js";
import { deleteCompleted, todos } from "./context/todos.js";
import { IfElse, When } from "../../../src/core/conditional.js";

const { footer, span, ul, button, li, div, p, a } = htmlElements;

const isSelected = (path) => (location.pathname === path ? "selected" : "");

export const Footer = (filtred) => {
  const active = todos.filterRef((t) => !t.completed);
  return IfElse(
    todos.len(),
    // When there are todos: show footer
    footer({ class: "footer" }).add(
      frag(
        When((w) => {
          return span({
            class: "todo-count",
            textContent: `${w(active).length} ${
              active().length === 1 ? "item" : "items"
            } left!`,
          });
        }),
        ul({ class: "filters" }).add(
          li().add(Link("/", "All", isSelected("/"))),
          li().add(Link("/active", "Active", isSelected("/active"))),
          li().add(Link("/completed", "Completed", isSelected("/completed")))
        ),
        button({
          class: "clear-completed",
          textContent: "Clear Completed",
          hidden: filtred.every((t) => !t.completed),
          onclick: deleteCompleted,
        })
      )
    ),
    footer({ class: "info" }).add(
      p({ textContent: "Double-click to edit a todo" }),
      p({ textContent: "Created by the TodoMVC Team" }),
      p().add(
        "Part of ",
        a({
          href: "http://todomvc.com",
          textContent: "TodoMVC",
        })
      )
    )
  );
};
