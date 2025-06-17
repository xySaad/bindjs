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
    } else if (Array.isArray(value)) {
      const temp = [];
      for (let i = 0; i < value.length; i++) {
        if (value[i] instanceof Reference) {
          temp[i] = value[i].value;
          value[i].onUpdate(() => {
            temp[i] = value[i].value;
            elm[key] = temp.join(" ");
          });
        } else {
          temp[i] = value[i];
        }
      }

      elm[key] = temp.join(" ");
    } else {
      elm[key] = value;
    }
  }
  return elm;
};

export const div = (attributes) => createElement("div", attributes);
export const button = (attributes) => createElement("button", attributes);
