import htmlElements from "../../src/html/index.js";
import { frag } from "../../src/html/custom/fragment.js";
import { Link } from "../../../src/router/Link.js";
import { deleteCompleted, todos } from "./context/todos.js";
import { When } from "../../../src/core/conditional.js";

const { footer, span, strong, ul, div, button } = htmlElements;

const isSelected = (path) => (location.pathname === path ? "selected" : "");

export const Footer = () => {
  return When(todos, (v) => {
    const completed = v.filter((t) => !t.completed);

    return (
      v.length > 0 &&
      footer({ class: "footer" }).add(
        frag(
          span({ class: "todo-count" }).add(
            strong({
              textContent: [
                completed.length,
                completed.length === 1 ? "item" : "items",
                "left!",
              ],
            })
          ),
          ul({ class: "filters" }).add(
            Link("/", "All", isSelected("/")),
            Link("/active", "Active", isSelected("/active")),
            Link("/completed", "Completed", isSelected("/completed"))
          ),
          button({
            class: "clear-completed",
            hidden: !v.some((t) => t.completed),
            onclick: deleteCompleted,
          }).add("Clear Completed")
        )
      )
    );
  });
};
