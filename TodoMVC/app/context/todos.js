import { list, router } from "rbind";

export const todoList = list([]);

export const getFilterFunc = () => {
  switch (router.currentPath) {
    case "/":
      return () => true;
    case "/active":
      return (t) => !t.checked.value;
    case "/completed":
      return (t) => t.checked.value;
    default:
      throw new Error("wtf?, how did you get here?!");
  }
};
export const todosInView = todoList.derive();

export const clearAll = () => {
  for (let i = 0; i < todoList.value.length; ) {
    if (todoList.value[i].checked.value) {
      todoList.remove(i);
    } else {
      i++;
    }
  }
};

export const toggleAll = (checked) => {
  todosInView.value.forEach((t) => {
    t.checked.value = checked;
  });
  todoList.trigger();
};
