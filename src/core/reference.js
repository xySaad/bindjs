class Reference {}

export const useReference = (defaultValue, name) => {
  let value = defaultValue;
  const triggers = new Set();

  const fn = function (newValue) {
    if (arguments.length === 0) {
      return value;
    }
    if (typeof newValue === "function") {
      value = newValue(value);
    } else {
      value = newValue;
    }

    for (const trigger of triggers) {
      // console.log(value);
      trigger(value);
    }

    return this;
  };
  //for debuggin
  fn.VarName = name;
  //
  fn.addTrigger = (trigger) => {
    triggers.add(trigger);
    trigger(value);
  };

  Object.setPrototypeOf(fn, Reference.prototype);
  return fn;
};

export const isReference = (value) => value instanceof Reference;
