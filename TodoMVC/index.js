import { section } from "../src/native.js";
import { Footer } from "./html/footer.js";
import { Header } from "./html/header.js";
import { Main } from "./html/main.js";

export const App = () => {

  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    Footer()
  );
};

document.body.append(App());

