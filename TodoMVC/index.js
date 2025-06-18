import { section } from "../src/native.js";
import { Footer } from "./html/footer.js";
import { Header, todoItem } from "./html/header.js";
import { Main, Task } from "./html/main.js";

export const App = () => {
  todoItem.onUpdate(() => {
    const todolist = document.querySelector(".todo-list")
    todolist.innerHTML=""
    todoItem.value.forEach(element => {
     todolist.append(Task(element))
      console.log(element);
      
    })
  })
  return section({ className: "todoapp", id: "root" }).add(
    Header(),
    Main(),
    Footer()
  );
};

document.body.append(App());

