import { a, div, footer, li, span, ul } from "../../src/native.js";
import { todoList } from "./context/todos.js";

export const Footer = () => {
  return footer({ className: "footer", "date-testid": "footer" }).add(
    span({
      className: "todo-count",
      textContent: [todoList.value.lenght, " item left!"],
    }),
    ul({ className: "filters", "data-testid": "footer-navigaion" }).add(
      li().add(a({ className: "", href: "/", textContent: "All" })),
      li().add(a({ className: "", href: "/active", textContent: "Active" })),
      li().add(
        a({ className: "", href: "/completed", textContent: "Completed" })
      )
    )
  );
};
