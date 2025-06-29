import { Footer } from "./footer.js";
import { Main } from "./main.js";
import { Header } from "./header.js";
import {displayedTodos, getFilterFunc, todoList } from "./context/todos.js";
import html from "rbind";

const { section } = html;
export const App = () => {
  displayedTodos(todoList.filter(getFilterFunc()))
  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    (w, c) => c(() => w(todoList).length > 0) && Footer()
  );
};
