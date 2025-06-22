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
  let condition = null;
  let conditionResult = null;
  const registerCondition = (c) => {
    condition = c;
    return (conditionResult = c());
  };

  const initalValue = effect(watch, registerCondition);
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

      const res = condition();
      if (conditionResult === res) return;
      conditionResult = res;

      const resolvedElement =
        effect((v) => v.value, registerCondition) ||
        document.createTextNode("");
      active?.replaceWith(resolvedElement);
      active = resolvedElement;
    };
  };

  ctx.forEach((props, ref) => {
    ref.register(trigger(props));
  });

  return active;
};
