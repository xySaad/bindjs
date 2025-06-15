import { Reference } from "../core/reference.js";

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

export const bindProto = {
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
  destroy() {
    if (this.__triggers) {
      for (const { ref, trigger } of this.__triggers) {
        ref.removeTrigger(trigger);
      }
      this.__triggers = null;
    }

    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }

  }
};

export const createBindElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.assign(element, bindProto);
  for (const [key, value] of Object.entries(attributes)) {
    if (Array.isArray(value)) {
      const internalValue = [];
      let scheduled = false;

      const updateAttr = () => {
        element.setAttr(key, internalValue.filter(Boolean).join(" "));
        scheduled = false;
      };

      for (const [i, v] of value.entries()) {
        if (v instanceof Reference) {
          internalValue[i] = v();

          v.addTrigger(
            (newVal) => {
              internalValue[i] = newVal;
              if (!scheduled) {
                scheduled = true;
                queueMicrotask(updateAttr);
              }
            },
            { invoke: false }
          );
        } else {
          internalValue[i] = v;
        }
      }
      element.setAttr(key, internalValue.filter(Boolean).join(" "));
    } else if (value instanceof Reference) {
      value.addTrigger((v) => element.setAttr(key, v));
    } else {
      element.setAttr(key, value);
    }
  }
  return element;
};
