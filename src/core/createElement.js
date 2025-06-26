import { When } from "./conditional.js";
import { List, State } from "./state.js";

export const bindProto = {
  add: function (...children) {
    const resolvedChildren = [];
    const frag = document.createDocumentFragment();
    for (const child of children) {
      const resolvedChild = typeof child === "function" ? When(child) : child;
      resolvedChildren.push(resolvedChild);
      frag.appendChild(resolvedChild);
    }
    this.onAppend = () => {
      this.append(frag);
      for (const child of resolvedChildren) {
        child.onAppend?.();
        if (child.autofocus) child.focus();
      }
    };
    return this;
  },

  bind: function (list, callback) {
    if (!(list instanceof List)) return;
    list.bind(this, callback);
    return this;
  },

  setAttr: function (key, value) {
    if (key in this) {
      this[key] = value;
    } else {
      this.setAttribute(key, value);
    }
  },
  // to skip setAttribute
  is: {},
  keydown: {},
};

export const createElement = (tag, attributes = {}) => {
  const elm = document.createElement(tag);
  Object.assign(elm, bindProto);
  elm.onkeydown = (e) => elm.keydown[e.key.toLowerCase()]?.(e);
  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof State) {
      value.register(() => elm.setAttr(key, value.value));
      elm.setAttr(key, value.value);
    } else if (Array.isArray(value)) {
      const temp = [];
      for (const [i, subValue] of value.entries()) {
        if (subValue instanceof State) {
          temp[i] = subValue.value;
          subValue.register(() => {
            temp[i] = subValue.value;
            // TODO: defer until exit of current call stack
            // wait until all dependencies from states binded with..
            // the current element are invoked then update DOM
            elm.setAttr(key, temp.join(" "));
          });
        } else {
          temp[i] = subValue;
        }
      }

      elm.setAttr(key, temp.join(" "));
    } else if (key === "className" && typeof value === "object" && value !== null) {
      for (const className in value) {
        const stateToWatch = value[className];

        if (stateToWatch instanceof State) {
          if (stateToWatch.value) {
            elm.classList.add(className);
          } else {
            elm.classList.remove(className);
          }
          stateToWatch.register((newValue) => {
            if (newValue) {
              elm.classList.add(className);
            } else {
              elm.classList.remove(className);
            }
          });
        } else {
          console.warn(`Value for data-bind-class "${className}" is not a State object.`, stateToWatch);
        }
      }
    } else {
      elm.setAttr(key, value);
    }
  }

  // TODO: don't force two way binding
  // two way binding should be used only when necessary
  for (const key in elm.is) {
    const value = elm.is[key];
    value.register(() => (elm[key] = value.value));
  }

  elm.onchange = (e) => {
    for (const key in elm.is) {
      const value = elm.is[key];
      value.value = e.target[key];
    }
  };
  return elm;
};
