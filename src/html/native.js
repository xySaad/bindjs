import { isReference } from "../core/reference.js";

const asyncAppend = function (...children) {
  (async () => {
    const results = [];
    for (const child of children) {
      try {
        const value = await child;
        results.push(value);
      } catch (err) {
        console.error(err);
      }
    }
    this.append(...results);
  })();

  return this;
};

export const query = (selector) => {
  const element = document.querySelector(selector);
  if (!element) return null;
  element.add = asyncAppend;
  return element;
};

const bindProto = {
  add(...children) {
    asyncAppend.apply(this, children);
    return this;
  },
  setAttr(key, value) {
    if (key in this) {
      this[key] = value;
    } else {
      this.setAttribute(key, value);
    }
  },
};

export const ce = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.assign(element, bindProto);
  for (const [key, value] of Object.entries(attributes)) {
    if (isReference(value)) {
      value.addTrigger((v) => element.setAttr(key, v));
    } else {
      element.setAttr(key, value);
    }
  }
  return element;
};

export const a = (href, child) => {
  const aElement = ce("a");
  aElement.href = href;
  return aElement.add(child);
};
