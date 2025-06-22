import { A } from "../../src/html/custom/anchor.js";
import { When } from "../src/core/conditional.js";
import html from "../src/index.js";
import { todoList } from "./context/todos.js";
const { footer, li, span, ul } = html;
export const Footer = () => {
  return footer({ className: "footer", "date-testid": "footer" }).add(
    When((w) => {
      const len = w(todoList).length;
      return span({
        className: "todo-count",
        textContent: `${len} ${len === 1 ? "item" : "items"} left!`,
      });
    }),
    ul({ className: "filters", "data-testid": "footer-navigaion" }).add(
      li().add(A("", "/", "All")),
      li().add(A("", "/active", "Active")),
      li().add(A("", "/completed", "Completed"))
    )
  );
};
