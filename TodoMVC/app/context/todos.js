import { list, router } from "../../src/index.js";

export const todoList = list([]);

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
export const todosInView = todoList.derive();

export const clearAll = () => {
  for (let i = 0; i < todosInView.value.length; ) {
    if (todosInView.value[i].checked) {
      todosInView.remove(i);
    } else {
      i++;
    }
  }
};

export const toggleAll = (checked) => {
  todoList.value.forEach((t) => {
    t.checked = checked;
  });
};
