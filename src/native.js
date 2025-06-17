import { Reference } from "./state.js";

export const createElement = (tag, attributes = {}) => {
  const elm = document.createElement(tag);
  elm.add = (...child) => {
    elm.append(...child);
    return elm;
  };
  
  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof Reference) {
      elm[key] = value.value;
      value.onUpdate(() => {
        elm[key] = value.value;
      });
    } else {
      elm[key] = value;
    }
  }
  return elm;
};

export const div = (attributes) => createElement("div", attributes);
export const button = (attributes) => createElement("button", attributes);
