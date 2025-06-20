import { HandleChange, SelectALl, UpdateComponent } from "../../src/helper.js";
import { button, div, input, label, li, main, ul } from "../../src/native.js";
import { ref } from "../../src/state.js";
import { todoList } from "./header.js";

export const Task = (item, i) => {
    const checked = ref(todoList.value[i].checked);
    return li({ className: checked.value ? "completed" : "", "data-testid": "todo-item" }).add(
        div({ className: "view" }).add(
            input({
                className: "toggle",
                checked,
                type: "checkbox",
                "data-testid": "todo-item-toggle",
                onchange: () => HandleChange(i)
            }),
            label({ "data-testid": "todo-item-label", textContent: item.value }),
            button({
                className: "destroy",
                "data-testid": "todo-item-button",
                onclick: () => todoList.Remove(i),
            })
        )
    );
};
const checkAllItems = () => {
    return div({ className: "toggle-all-container" }).add(
        input({
            className: "toggle-all",
            type: "checkbox",
            id: "toggle-all",
            "data-testid": "toggle-all",
            onclick: SelectALl,
        }),
        label({
            className: "toggle-all-label",
            for: "toggle-all",
            textContent: "Toggle All Input",
        })

    );
};

export const Main = () => {
    return main({ className: "main", "data-testid": "main" }).add(
        checkAllItems(),
        UpdateComponent(
            ul({ className: "todo-list", "data-testid": "todo-list" }),
            todoList,
            Task
        )
    );
};
