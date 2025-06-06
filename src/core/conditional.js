export const and = (first, last) => (first ? last : "");
export const eq = (comparable, result) => (reference) =>
  and(reference === comparable, result);

export const When = (reference, resolver) => {
  let active = null;

  reference.addTrigger(async (value) => {
    const resolvedElement = resolver(value);
    active?.replaceWith(resolvedElement);
    active = resolvedElement;
  });
  
  return active;
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
