import { section } from "../../src/native.js";
import { Footer } from "./footer.js";
import { Main } from "./main.js";

import { Header } from "./header.js";

export const App = () => {
  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    Footer()
  );
};
