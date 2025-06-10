import { frag } from "../html/custom/fragment.js";

export class Reference {}

export const useReference = (defaultValue, modifier = (v) => v) => {
  let value = defaultValue;
  const triggers = new Set();

  const fn = function (newValue) {
    if (arguments.length === 0) return value;
    if (typeof newValue === "function") {
      value = modifier(newValue(value));
    } else {
      value = modifier(newValue);
    }
    for (const trigger of triggers) trigger(value);
    return this;
  };

  fn.addTrigger = (trigger, { invoke = true } = {}) => {
    triggers.add(trigger);
    if (invoke) return trigger(value);
  };

  fn.map = function (callback) {
    const commentStart = document.createComment("bindjs-fragment-start");
    const commentEnd = document.createComment("bindjs-fragment-end");
    const fragment = frag(commentStart, commentEnd);
    const range = document.createRange();

    this.addTrigger((v) => {
      range.setStartAfter(commentStart);
      range.setEndBefore(commentEnd);
      range.deleteContents();
      const nodeList = v.map(callback);
      commentStart.after(...nodeList);
    });
    return fragment;
  };
  fn.every = function (callback) {
    const ref = useReference();
    this.addTrigger((v) => ref(v.every(callback)));
    return ref;
  };
  fn.filterRef = function (callback) {
    const ref = useReference();
    this.addTrigger((v) => ref(v.filter(callback)));
    return ref;
  };
  fn.len = function () {
    const ref = useReference();
    this.addTrigger((v) => ref(v.length));
    return ref;
  };

  Object.setPrototypeOf(fn, Reference.prototype);
  return fn;
};
