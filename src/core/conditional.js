export const and = (first, last) => (first ? last : "");
export const eq = (comparable, result) => (reference) =>
  and(reference === comparable, result);

export const If = (reference, element) => {
  let active = null;

  reference.addTrigger(async (value) => {
    const resolvedElement = value ? element : document.createTextNode("");
    active?.replaceWith(resolvedElement);
    active = resolvedElement;
  });

  return active;
};

export const When = (reference, resolver) => {
  let active = null;

  reference.addTrigger(async (value) => {
    const resolvedElement = resolver(value) || document.createTextNode("");
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

  return [toggleFunc, switchFunc, ref];
};
