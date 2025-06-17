export const createElement = (tag, attributes = {}) => {
  const elm = document.createElement(tag);
  elm.add = (...child) => {
    elm.append(...child);
    return elm;
  };

  for (const [key, value] of Object.entries(attributes)) {
    elm[key] = value;
  }
  return elm;
};

export const div = (attributes) => createElement("div", attributes);
export const button = (attributes) => createElement("button", attributes);
