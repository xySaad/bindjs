import { ref } from "./state.js";

export const bind = (valueToUpdate, prop) => {
  const defaultValue = prop ? valueToUpdate[prop] : valueToUpdate;
  const state = ref(defaultValue);
  state.register((v) => (valueToUpdate[prop] = v));
  return state;
};

export const bindAs = (stateToTrack, prop) => {
  stateToTrack.register
};
