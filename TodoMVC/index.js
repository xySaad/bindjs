import { section } from "../src/native.js";
import { Footer } from "./app/footer.js";
import { Header } from "./app/header.js";
import { Main } from "./app/main.js";

export const App = () => {
  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    Footer()
  );
};

document.body.append(App());
