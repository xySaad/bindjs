import { ref } from "./state.js";

export const bind = (stateToUpdate, prop) => {
  const defaultValue = prop ? stateToUpdate[prop] : stateToUpdate;
  const state = ref(defaultValue);
  state.register((v) => (stateToUpdate[prop] = v));
  return state;
};
