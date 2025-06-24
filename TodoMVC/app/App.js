import { Footer } from "./footer.js";
import { Main } from "./main.js";
import { Header } from "./header.js";
import { todosInView, getFilterFunc, todoList } from "./context/todos.js";
import html from "../src/index.js";
const { section } = html;
export const App = () => {
  const filterFunc = getFilterFunc();
  todosInView.value = todoList.value.filter(filterFunc);

  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    (w, c) => c(() => w(todoList).length > 0) && Footer()
  );
};
