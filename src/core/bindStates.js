import { ref } from "./state.js";

export const bind = (valueToUpdate, prop) => {
  const defaultValue = prop ? valueToUpdate[prop] : valueToUpdate;
  const state = ref(defaultValue);
  state.register((v) => (valueToUpdate[prop] = v));
  return state;
};

export const bindAs = (stateToTrack, prop, callback) => {
  const state = ref(stateToTrack.value);
  stateToTrack.register((v) => {
    let newValue = prop ? v[prop] : v;

    if (callback) newValue = newValue.call(v, callback);
    state.value = newValue;
  });
  return state;
};
