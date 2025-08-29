import { When } from "./conditional.js";
import { State } from "./state.js";

export const bindProto = {
  // to skip setAttribute
  is: {},
  keydown: {},

  childrenQueue: null,
  add: function (...children) {
    this.childrenQueue = children.map((child) =>
      typeof child === "function" ? When(child) : child
    );
    return this;
  },
  mount: function () {
    if (!this.childrenQueue) return;
    this.append(...this.childrenQueue);
    for (const child of this.childrenQueue) {
      child.mount?.(); // might be a textNode placeholder which doesn't have .mount
      if (child.autofocus) child.focus();
    }
  },
  setAttr: function (key, value) {
    if (!key.startsWith("on") && typeof value === "function") {
      When((watcher) => {
        const result = value(watcher);
        this.setAttr(key, result);
      });
    } else if (key in this) {
      this[key] = value;
    } else {
      this.setAttribute(key, value);
    }
  },
};

export const createElement = (tag, attributes = {}) => {
  const elm = document.createElement(tag);
  Object.assign(elm, bindProto);
  elm.onkeydown = (e) => elm.keydown[e.key.toLowerCase()]?.(e);
  for (const [key, value] of Object.entries(attributes)) {
    if (value instanceof State) {
      value.register(() => elm.setAttr(key, value.value));
      elm.setAttr(key, value.value);
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
