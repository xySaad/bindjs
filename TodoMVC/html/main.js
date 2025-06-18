import { IF } from "../../src/Conditionals.js"
import { button, div, input, label, li, main, ul } from "../../src/native.js"
import { todoItem } from "./header.js"
export const Task = (item) => {
    return li({ className: "", "data-testid": "todo-item" }).add(
        div({ className: "view" }).add(
            input({ class: "toggle", type: "checkbox", "data-testid": "todo-item-toggle" }),
            label({ "data-testid": "todo-item-label", textContent: item }),
            button({ class: "destroy", "data-testid": "todo-item-button" })
        )
    )
}


export const Main = () => {
    return main({ className: "main", "date-testid": "main" }).add(
        ul({ className: "todo-list", "data-testid": "todo-list" }).add(IF(todoItem.value.length!=0,Task(todoItem.value[0])))
    )
}

