import { Footer } from "./footer.js";
import { Main } from "./main.js";
import { Header } from "./header.js";
import { getFilterFunc, todoList } from "./context/todos.js";
import html, { list } from "../src/index.js";
const { section } = html;
export const App = () => {
  const filtred = list(todoList.value.filter(getFilterFunc()));
  filtred.synced.push(todoList);
  return section({ className: "todoapp", id: "root" }).add(
    Header(filtred),
    Main(filtred),
    (w, c) => c(() => w(todoList).length > 0) && Footer()
  );
};
