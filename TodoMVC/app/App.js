import { Footer } from "./footer.js";
import { Main } from "./main.js";
import { Header } from "./header.js";
import { displayedTodos, getFilterFunc, todoList } from "./context/todos.js";
import html, { router } from "rbind";

const { section } = html;
export const App = () => {
  router.register(() => displayedTodos.refine(getFilterFunc()));
  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    (w, c) => c(() => w(todoList).length > 0) && Footer()
  );
};
