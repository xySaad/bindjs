import { div, footer, li, span, ul } from "../../src/native.js";
import { todoList } from "./header.js";

export const Footer = () => {
  console.log(todoList.value.lenght);

  return footer({ className: "footer", "date-testid": "footer" }).add(
    span({
      class: "todo-count",
      textContent: [todoList.value.lenght, " item left!"],
    }),
    ul({ className: "filters", "data-testid": "footer-navigaion" }).add(
      li().add(div("a", { className: "", href: "#/" })),
      li().add(div("a", { className: "", href: "#/avtive" })),
      li().add(div("a", { className: "", href: "#/comleted" }))
    )
  );
};
