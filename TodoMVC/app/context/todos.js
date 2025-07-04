import { list, router } from "rbind";

export const todoList = list([]);

export const getFilterFunc = () => {
  switch (router.path.value) {
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
export const displayedTodos = todoList.filter(getFilterFunc());
export const clearAll = () => {
  todoList.purge((v) => v.checked);
};

export const toggleAll = (checked) => {
  [...displayedTodos.value].forEach((t) => {
    t.checked = checked;
  });
};
