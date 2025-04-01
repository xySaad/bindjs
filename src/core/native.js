import { isReference } from "./reference.js";
import { isConditionalElement } from "./states.js";
export const _ = null;

const append = function (...children) {
  for (const child of children) {
    const toAppend = isConditionalElement(child) ? child.getActive() : child
    Element.prototype.append.call(this.active, toAppend.active);
  }  
  return this;
};

export const q = (selector) => {
  const element = document.querySelector(selector);
  if (element === null) {
    return element;
  }
  return {
    active: element,
    append: append,
  };
};

export const ce = (tagName, className, textContent, ...eventListeners) => {
  const element = document.createElement(tagName);

  for (const evListener of eventListeners) {
    element[evListener.eventProperty] = evListener.callback;
  }

  if (isReference(className)) {
    className.addTrigger((value) => (element.classList = value));
  } else if (className) element.className = className;

  if (isReference(textContent)) {
    textContent.addTrigger((value) => (element.textContent = value));
  } else if (textContent) element.textContent = textContent;

  return {
    active: element,
    append: append,
  };
};

export const div = (className, textContent, ...eventListeners) =>
  ce("div", className, textContent, ...eventListeners);

export const button = (textContent, ...eventListeners) =>
  ce("button", _, textContent, ...eventListeners);

const importSvg = (svgName) => (svgName ? "/svg/" + svgName + ".svg" : "");

export const a = (href, child) => {
  const aElement = ce("a");
  aElement.href = href;
  return aElement.append(child);
};

export const select = (className, ...eventListeners) =>
  ce("select", className, _, ...eventListeners);
export const option = (value, text) => {
  const optionElement = ce("option", value);
  optionElement.active.value = value;
  optionElement.active.text = text;

  return optionElement;
};

export const input = (type, placeholder, ...eventListeners) => {
  const inputElement = ce("input", _, _, ...eventListeners);
  inputElement.active.type = type;
  inputElement.active.placeholder = placeholder;
  return inputElement;
};

class EventListener {
  constructor(callback, eventProperty) {
    this.callback = callback;
    this.eventProperty = eventProperty;
  }
}

export const onclick = (callback) => new EventListener(callback, "onclick");
export const oninput = (callback) => new EventListener(callback, "oninput");
export const onchange = (callback) => new EventListener(callback, "onchange");
