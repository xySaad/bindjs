import {
  div,
  footer,
  h1,
  header,
  main,
  section,
  input,
  label,
  ul,
} from "../src/native.js";
 export const CreatHTML=()=>{
   return  section({ className: "todoapp", id: "root" }).add(
        header({ className: "header", "date-testid": "header" }).add(
          h1({ textContent: "todos" }),
          div({ className: "input-container" }).add(
            input({
              className: "new-todo",
              id: "todo-input",
              type: "text",
              "data-testid": "text-input",
              placeholder: "What needs to be done?",
            }),
            label({
              className: "visually-hidden",
              for: "todo-input",
              textContent: "New Todo Input",
            })
          )
        ),
        main({ className: "main", "date-testid": "main" }).add(
          ul({ className: "todo-list", "data-testid": "todo-list" })
        ),
        footer({ className: "footer", "date-testid": "footer" })
      );
}

