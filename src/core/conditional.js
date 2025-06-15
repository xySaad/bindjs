export const and = (first, last) => (first ? last : "");
export const eq = (comparable, result) => (reference) =>
  and(reference === comparable, result);

export const If = (reference, element) => {
  let active = null;

  reference.addTrigger(async (value) => {
    const resolvedElement = value ? element : document.createTextNode("");
    if (active === resolvedElement) return;
    active?.replaceWith(resolvedElement);
    active = resolvedElement;
  });

  return active;
};

export const IfElse = (reference, trueElement, falseElement) => {
  let active = null;

  reference.addTrigger(async (value) => {
    const resolvedElement = value ? trueElement : falseElement;
    if (active === resolvedElement) return;
    active?.replaceWith(resolvedElement);
    active = resolvedElement;
  });

  return active;
};

export const When = (effect) => {
  const ctx = new Map();
  const watch = (ref) => {
    const px = new Proxy(ref, {
      get(target, prop) {
        const v = target()[prop];
        ctx.get(ref)[prop] = v;
        return v;
      },
    });
    ctx.set(ref, {});
    return px;
  };

  const initalValue = effect(watch);
  let active = initalValue || document.createTextNode("");
  const trigger = (props) => {
    return (refValue) => {
      const hasChanged = Object.getOwnPropertyNames(refValue).some((key) => {
        const value = refValue[key];
        if (Object.hasOwn(props, key) && props[key] !== value) {
          props[key] = value;
          return true;
        }
      });

      if (!hasChanged) return;
      const resolvedElement = effect((v) => v()) || document.createTextNode("");
      active?.replaceWith(resolvedElement);
      active = resolvedElement;
    };
  };

  ctx.forEach((props, ref) => {
    ref.addTrigger(trigger(props), { invoke: false });
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
