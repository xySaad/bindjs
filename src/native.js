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
export const section = (attributes) => createElement("section", attributes);
export const h1 = (attributes) => createElement("h1", attributes);
export const header = (attributes) => createElement("header", attributes);
export const input = (attributes) => createElement("input", attributes);
export const main = (attributes) => createElement("main", attributes);
export const li = (attributes) => createElement("li", attributes);
export const label = (attributes) => createElement("label", attributes);
export const footer = (attributes) => createElement("footer", attributes);
export const ul = (attributes) => createElement("ul", attributes);
