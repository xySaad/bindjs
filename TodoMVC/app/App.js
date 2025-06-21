import html from "../src/index.js";
import { Footer } from "./footer.js";
import { Main } from "./main.js";
import { Header } from "./header.js";
const { section } = html;
export const App = () => {
  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    Footer()
  );
};
