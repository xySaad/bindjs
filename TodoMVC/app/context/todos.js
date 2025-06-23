import { list } from "../../src/index.js";

export const todoList = list([]);

export const toggleAll = (checked) => {
  todoList.value = todoList.value.map((t) => ({
    value: t.value,
    checked,
  }));
};
