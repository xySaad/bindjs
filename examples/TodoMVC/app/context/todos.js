import { useReference } from "../../src/core/reference.js";
import { uuid } from "../utils/uuid.js";
export const todoType = {
  completed: false,
  title: "",
  id: "",
};

export const todos = useReference([]);

export const addTodo = (value) => {
  const newTodo = {
    completed: false,
    title: value,
    id: uuid(),
  };

  todos((prev) => [...prev, newTodo]);
};

export const deleteTodo = (todo) => {
  todos((prev) => prev.filter((t) => t !== todo));
};

export const deleteCompleted = () => {
  todos((prev) => prev.filter((todo) => !todo.completed));
};

export const toggleAll = (value) => {
  todos((prev) => prev.map((t) => ({ ...t, completed: value })));
};

export const filterTodo = () => {
  switch (location.pathname) {
    case "/active":
      return (todo) => !todo.completed;
    case "/completed":
      return (todo) => todo.completed;
    default:
      return () => true;
  }
};
