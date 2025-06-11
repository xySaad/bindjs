import { frag } from "../src/html/custom/fragment.js";
import { Main } from "./components/Main.js";
import { getFilter, todos } from "./context/todos.js";
import { Footer } from "./Footer.js";
import { Header } from "./Header.js";

export const App = () => {
  const filtred = todos.filterRef(getFilter());

  return frag(Header(), Main(filtred), Footer(filtred));
};
