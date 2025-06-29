import { BetterList, router } from "rbind";
import { ref } from "rbind";

export const todoList = new BetterList([]);

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
export const displayedTodos = ref(null);

export const clearAll = () => {
  todoList.purge((v) => v.checked);
};

export const toggleAll = (checked) => {
  displayedTodos().value.forEach((t) => {
    t.checked = checked;
  });
};
