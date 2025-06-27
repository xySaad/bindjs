export const When = (effect) => {
  const ctx = new Map();
  const watch = (state) => {
    ctx.set(state, {});

    const px =
      typeof state.value === "object"
        ? new Proxy(state, {
            get(target, prop) {
              const v = target.value[prop];
              ctx.get(state)[prop] = v;
              return v;
            },
          })
        : state.value;
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
      let hasChanged = typeof stateValue === "object" ? false : true;
      for (const key in props) {
        const value = stateValue[key];
        if (value !== props[key]) {
          props[key] = value;
          hasChanged = true;
          break;
        }
      }

      if (!hasChanged) return;

      const res = condition();
      if (conditionResult === res) return;
      conditionResult = res;

      const resolvedElement =
        effect((v) => v.value, registerCondition) ||
        document.createTextNode("");
      active?.replaceWith(resolvedElement);
      resolvedElement.onAppend?.()
      active = resolvedElement;
    };
  };

  ctx.forEach((props, state) => {
    state.register(trigger(props));
  });

  return active;
};
