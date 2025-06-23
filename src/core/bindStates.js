import { state } from "./state.js";

export const bind = (valueToUpdate, prop) => {
  const defaultValue = prop ? valueToUpdate[prop] : valueToUpdate;
  const st = state(defaultValue);
  st.register((v) => (valueToUpdate[prop] = v));
  return st;
};

export const bindAs = (stateToTrack, prop, callback) => {
  const st = state(stateToTrack.value);
  stateToTrack.register((v) => {
    let newValue = prop ? v[prop] : v;

    if (callback) newValue = newValue.call(v, callback);
    st.value = newValue;
  });
  return st;
};
