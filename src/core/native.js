import { isReference } from "./reference.js";
import { importSvg } from "../utils/import.js";

export const asyncAppend = function (...children) {
  this.promise = (async () => {
    const settled = await Promise.allSettled(children);
    const results = settled
      .filter((p) => {
        if (p.status === "fulfilled") return true;
        console.error(p.reason);
        return false;
      })
      .map((p) => p.value);
    this.append(...results);
  })();
  return this;
};

export const query = (selector) => {
  const element = document.querySelector(selector);
  if (!element) return element;
  element.add = asyncAppend;
  element.on = function (eventName, callback) {
    element["on" + eventName] = callback;
    return this;
  };
  return element;
};

export const ce = (
  tagName,
  className = "",
  textContent = "",
  attributes = {}
) => {
  const element = document.createElement(tagName);

  if (isReference(className)) {
    className.addTrigger((value) => {
      element.classList = value;
    });
  } else {
    element.className = className;
  }

  if (isReference(textContent)) {
    textContent.addTrigger((value) => {
      element.textContent = value;
    });
  } else {
    element.textContent = textContent;
  }

  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on") && typeof value === "function") {
      element[key] = value;
    } else if (isReference(value)) {
      value.addTrigger((v) => {
        element.setAttribute(key, v);
      });
    } else {
      element.setAttribute(key, value);
    }
  }

  element.add = asyncAppend;

  return element;
};

export const div = (className, textContent, attr) =>
  ce("div", className, textContent, attr);

export const input = (className, placeholder, required, type, attr = {}) => {
  if (!!required) attr.required = "";
  return ce("input", className, "", {
    placeholder,
    type: type ?? "text",
    ...attr,
  });
};

export const form = (className, attr = {}) => ce("form", className, null, attr);
export const button = (className, textContent, type, attr = {}) =>
  ce("button", className, textContent, { type, ...attr });

export const img = (src, alt, attr) =>
  ce("img", "", "", {
    src,
    alt,
    onerror() {
      this.onerror = null;
      this.src = importSvg(alt) ?? this.remove();
    },
    ...attr,
  });

export const a = (href, child) => {
  const aElement = ce("a");
  aElement.href = href;
  return aElement.add(child);
};

export const option = (value, text) => {
  const optionElement = ce("option", value);
  optionElement.value = value;
  optionElement.text = text;

  return optionElement;
};

export const select = (className, attr) => ce("select", className, "", attr);
export const frag = (...children) => {
  const fragment = document.createDocumentFragment();
  asyncAppend.call(fragment, ...children);
  return fragment;
};
