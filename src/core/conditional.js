export const and = (first, last) => (first ? last : "");
export const eq = (comparable, result) => (reference) =>
  and(reference === comparable, result);

export const When = (reference, resolver) => {
  let element = {};
  reference.addTrigger(async (value) => {
    const active = element.active;
    const resolvedElement = resolver(value);

    if (active instanceof DocumentFragment) {
      while (active.firstChild) active.removeChild(active.firstChild);
      if (resolvedElement instanceof DocumentFragment) {
        console.log("appending:", resolvedElement.childNodes);
        active.append(...resolvedElement.childNodes);
      } else {
        console.log("resolved elm", resolvedElement);
        
        active.appendChild(resolvedElement);
      }
    } else {
      active?.replaceWith(resolvedElement);
    }

    element.active = resolvedElement;
  });
  element.active = resolver(reference());
  return element.active;
};

export const toggle = (a, b) => {
  const ref = useReference(a);
  const toggleFunc = () => {
    ref((prev) => (prev === a ? b : a));
  };

  const switchFunc = (first, second) =>
    When(ref, (v) => (a === v ? first : second));
  return { toggle: toggleFunc, switch: switchFunc, list: [a, b], ref };
};
