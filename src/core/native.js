import { isReference, useReference } from "./reference.js";
export const _ = null;
class Null {
  constructor() {}
}

const append = function (...children) {
  for (const child of children) {
    Element.prototype.append.call(this.active, child.active);
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

// Conditional rendering
export const useDependency = (dependency, resolver) => {
  const newRefernce = useReference();
  dependency.addTrigger((value) => newRefernce(resolver(value)));
  return newRefernce;
};

export const When = (reference, condition) => {
  const isTruthy = (value) => (condition && condition(value)) || value;

  let element = {};

  return {
    show: (trueElement) => {
      reference.addTrigger((value) => {
        if (isTruthy(value)) {
          element.active?.replaceWith(trueElement.active);
          element.active = trueElement.active;
        }
      });

      return {
        else: (falseElement) => {
          reference.addTrigger((value) => {
            if (isTruthy(value)) {
            } else {
              element.active?.replaceWith(falseElement.active);
              element.active = falseElement.active;
            }
          });

          return element;
        },
      };
    },
    do: (trueValue, falseValue) => {
      return useDependency(reference, (v) => v?trueValue: falseValue);
    },
  };
};

// this function maybe useful in case of using a tanspiler like Babel to convert JSX
// NOTE: this will result in rendering the inner condition each time the outer condition got rendered even if the inner condition dependencies aren't changed
export const WhenFunctionBased = (reference) => {
  let element = {};
  return (resolver) => {
    console.log(resolver.toString());
    reference.addTrigger((value) => {
      const resolvedElement = resolver(value);
      element.active?.replaceWith(resolvedElement.active);
      element.active = resolvedElement.active;
    });
    return resolver(reference());
  };
};
// example
// When(isLoading)((v) =>
//   v
//     ? div("loading", "loading...")
//     : When(pairCode)((v) =>
//         v ? div("pairCode", pairCode) : phoneInput
//       )
// ),
///////////////////////////

// Loading state
export const useLoading = (asynFunc) => {
  let _loadingElement = null;
  let _resolveElement = null;
  let _fallbackElement = null;

  const fn = (...args) => {
    _resolveElement.active.replaceWith(_loadingElement.active);
    _fallbackElement?.active.replaceWith(_loadingElement.active);

    const result = asynFunc(...args);

    result.catch(() => {
      _loadingElement.active.replaceWith(_fallbackElement?.active);
    });

    result.then(() => {
      _loadingElement.active.replaceWith(_resolveElement.active);
    });

    return result;
  };

  const loadingFn = (loadingElement) => {
    _loadingElement = loadingElement;

    _loadingElement.then = (resolveElement) => {
      _resolveElement = resolveElement;
      _resolveElement.catch = (fallbackElement) => {
        _fallbackElement = fallbackElement;
        return _resolveElement;
      };

      return _resolveElement;
    };

    return _loadingElement;
  };

  return [fn, loadingFn];
};
