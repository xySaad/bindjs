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

  fn.addTrigger = (trigger) => {
    triggers.add(trigger);
    return trigger(value);
  };

  fn.map = function (callback) {
    const commentStart = document.createComment("bindjs-fragment-start");
    const commentEnd = document.createComment("bindjs-fragment-end");
    const fragment = frag(commentStart, commentEnd);
    const range = document.createRange();

    this.addTrigger((v) => {
      range.setStartAfter(commentStart);
      range.setEndBefore(commentEnd);
      console.log(range.startContainer);
      range.deleteContents();
      const nodeList = v.map(callback);
      commentStart.after(...nodeList);
    });
    return fragment;
  };
  Object.setPrototypeOf(fn, Reference.prototype);
  return fn;
};
