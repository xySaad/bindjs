export const q = (selector) => document.querySelector(selector);

export const ce = (tagName, className, textContent) => {
  const element = document.createElement(tagName);
  element.className = className ?? "";
  element.textContent = textContent ?? "";
  return element;
};

export const div = (className, textContent) =>
  ce("div", className, textContent);

export const a = (href, child) => {
  const aElement = ce("a");
  aElement.href = href;
  aElement.append(child);
  return aElement;
};
