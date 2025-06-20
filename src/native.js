import { List, State } from "./state.js";

const bindProto = {
  add: function (...child) {
    this.append(...child);
    return this;
  },

  bind: function (list, callback) {
    if (!(list instanceof List)) return;
    list.bind(this, callback);
    return this;
  },

  // setAttr: function (key, value) {
  //   if (key in this) {
  //     this[key] = value;
  //   } else {
  //     this.setAttribute(key, value);
  //   }
  // },
};

export const createElement = (tag, attributes = {}) => {
  const elm = document.createElement(tag);
  Object.assign(elm, bindProto);
  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof State) {
      elm[key] = value.value;
      const trigger = () => {
        elm[key] = value.value;
      };
      elm._refTrigger = trigger;
      value.register(trigger);
    } else if (Array.isArray(value)) {
      const temp = [];
      for (let i = 0; i < value.length; i++) {
        if (value[i] instanceof State) {
          temp[i] = value[i].value;
          value[i].register(() => {
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

  const is = Object.entries(elm.is ?? {});
  for (const [key, value] of is) {
    if (!(value instanceof State))
      throw new Error(
        `can't bind ${key} to ${value} because it doesn't implement interface State`
      );

    value.register(() => {
      elm[key] = value.value;
    });
  }

  elm.onchange = (e) => {
    for (const [key, value] of is) {
      value.value = e.target[key];
    }
  };
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
export const span = (attributes) => createElement("span", attributes);
