import { todoList } from "../TodoMVC/html/header.js";
import { List } from "./state.js";

export function UpdateComponent(parentNode, listState, component) {
  if (!(listState instanceof List)) throw new Error("listState doesn't implement interface List");
  listState.value.forEach((e, i) => {
    parentNode.add(component(e.value, i));
  })
  listState.register(() => {
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
    listState.value.forEach((e, i) => {
      parentNode.add(component(e, i));
    });
  });
  return parentNode;

}


export const SelectALl = (e) => {
  const isChecked = e.target.checked
  todoList.value = todoList.value.map((t) => ({ ...t, checked: isChecked }))
}