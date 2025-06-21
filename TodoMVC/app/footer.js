import { A } from "../../src/html/custom/anchor.js";
import html from "../src/index.js";
import { todoList } from "./context/todos.js";
const { footer, li, span, ul } = html;
export const Footer = () => {
  return footer({ className: "footer", "date-testid": "footer" }).add(
    span({
      className: "todo-count",
      textContent: [todoList.value.lenght, " item left!"],
    }),
    ul({ className: "filters", "data-testid": "footer-navigaion" }).add(
      li().add(A("", "/", "All")),
      li().add(A("", "/active", "Active")),
      li().add(A("", "/completed", "Completed"))
    )
  );
};
