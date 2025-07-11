import { When } from "./conditional.js";
import { State } from "./state.js";

export const bindProto = {
  add: function (...children) {
    try {
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
    } catch (error) {
      console.error(error);
    }
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
    } else if (!key.startsWith("on") && typeof value === "function") {
      When((watcher) => {
        const result = value(watcher);
        elm.setAttr(key, result || "");
      });
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

  elm.oninput = (e) => {
    for (const key in elm.is) {
      const value = elm.is[key];
      value.value = e.target[key];
    }
  };

  elm.onchange = (e) => {
    for (const key in elm.is) {
      const value = elm.is[key];
      value.value = e.target[key];
    }
  };
  return elm;
};
