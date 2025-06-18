import { UpdateComponent } from "../../src/helper.js"
import { button, div, input, label, li, main, ul } from "../../src/native.js"
import { todoItem } from "./header.js"
export const Task = (item) => {
    return li({ className: "", "data-testid": "todo-item" }).add(
        div({ className: "view" }).add(
            input({ className: "toggle", type: "checkbox", "data-testid": "todo-item-toggle" }),
            label({ "data-testid": "todo-item-label", textContent: item }),
            button({ className: "destroy", "data-testid": "todo-item-button" })
        )
    )
}

export const Main = () => {
    return main({ className: "main", "data-testid": "main" }).add(UpdateComponent(ul({ className: "todo-list", "data-testid": "todo-list" }), todoItem, Task)
    );
}

