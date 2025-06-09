import { frag } from "../src/html/custom/fragment.js";
import html from "../src/html/index.js";
import { TodoItem } from "./components/TodoItem.js";
import { filterTodo, todos, toggleAll } from "./context/todos.js";
import { Footer } from "./Footer.js";
import { Header } from "./Header.js";
const { div, ul, input, label, main } = html;

export const App = () => {
  const filter = filterTodo();

  return frag(
    Header(),
    main().add(
      div({ class: "toggle-all-container" }).add(
        input({
          class: "toggle-all",
          type: "checkbox",
          id: "toggle-all-input",
          onchange: (e) => toggleAll(e.target.checked),
        }),
        label({
          class: "toggle-all-label",
          htmlFor: "toggle-all-input",
          textContent: "Toggle All Input",
        })
      ),
      ul({ class: "todo-list" }).add(
        todos.map((t) => (filter(t) ? TodoItem(t) : ""))
      )
    ),
    Footer()
  );
};
