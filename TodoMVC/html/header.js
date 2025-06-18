import { div, h1, header, input, label } from "../../src/native.js"
import { ref } from "../../src/state.js"

export let todoItem = ref([])
export const Header = () => {
    const HandleChange = (e) => {
        if (e.key == "Enter"&&e.target.value.trim().length!=0) {
            todoItem.Push(e.target.value)
            e.target.value=""
        }
    }
    return header({ className: "header", "date-testid": "header" }).add(
        h1({ textContent: "todos" }),
        div({ className: "input-container" }).add(
            input({
                className: "new-todo",
                id: "todo-input",
                type: "text",
                "data-testid": "text-input",
                placeholder: "What needs to be done?",
                onkeydown: (e) => HandleChange(e)

            }),
            label({
                className: "visually-hidden",
                for: "todo-input",
                textContent: "New Todo Input",
            })
        )
    )
}