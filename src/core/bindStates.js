import { state } from "./state.js";

export const bind = (valueToUpdate, prop) => {
  const defaultValue = prop ? valueToUpdate[prop] : valueToUpdate;
  const st = state(defaultValue);
  st.register((v) => (valueToUpdate[prop] = v));
  return st;
};

export const bindAs = (stateToTrack, prop, callback) => {
  const resolveDerivedStateValue = (v) => {
    let newValue = prop ? v[prop] : v;
    if (callback) newValue = newValue.call(v, callback);
    return newValue;
  };
  
  const st = state(resolveDerivedStateValue(stateToTrack.value));
  stateToTrack.register((v) => (st.value = resolveDerivedStateValue(v)));
  return st;
};
