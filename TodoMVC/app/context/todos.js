import { list, router } from "../../src/index.js";

export const todoList = list([]);

export const toggleAll = (checked) => {
  todoList.value = todoList.value.map((t) => ({
    value: t.value,
    checked,
  }));
};

export const getFilterFunc = () => {
  switch (router.currentPath) {
    case "/":
      return () => true;
    case "/active":
      return (t) => !t.checked;
    case "/completed":
      return (t) => t.checked;
    default:
      throw new Error("wtf?, how did you get here?!");
  }
};
