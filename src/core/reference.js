export const ref = (defaultValue) => {
  let value = defaultValue;
  return function (newValue) {
    if (arguments.length === 0) return value;
    if (typeof newValue === "function") value = newValue(value);
    else value = newValue;
  };
};
