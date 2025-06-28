import { list, router } from "rbind";

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
  todosInView.purge((v) => v.checked);
  todoList.purge((v) => v.checked);
};

export const toggleAll = (checked) => {
  todosInView.value.forEach((t) => {
    t.checked = checked;
  });
};
