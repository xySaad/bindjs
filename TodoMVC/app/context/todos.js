import { ref } from "../../src/index.js";

export const todoList = ref([]);

export const toggleAll = (checked) => {
  todoList.value = todoList.value.map((t) => ({
    value: t.value,
    checked,
  }));
};
