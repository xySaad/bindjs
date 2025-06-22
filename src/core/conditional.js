export const When = (effect) => {
  const ctx = new Map();
  const watch = (ref) => {
    const px = new Proxy(ref, {
      get(target, prop) {
        const v = target.value[prop];
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
      const resolvedElement =
        effect((v) => v.value) || document.createTextNode("");
      active?.replaceWith(resolvedElement);
      active = resolvedElement;
    };
  };

  ctx.forEach((props, ref) => {
    ref.register(trigger(props));
  });

  return active;
};
