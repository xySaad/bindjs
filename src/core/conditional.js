export const When = (effect) => {
  const ctx = new Map();
  const watch = (state) => {
    const px = new Proxy(state, {
      get(target, prop) {
        const v = target.value[prop];
        ctx.get(state)[prop] = v;
        return v;
      },
    });
    ctx.set(state, {});
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
    return (stateValue) => {
      const hasChanged = Object.getOwnPropertyNames(stateValue).some((key) => {
        const value = stateValue[key];
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

  ctx.forEach((props, state) => {
    state.register(trigger(props));
  });

  return active;
};
