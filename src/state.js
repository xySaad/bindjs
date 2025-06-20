export class State {
  #value = null;
  constructor(defaultValue) {
    this.#value = defaultValue;
  }
  set value(newValue) {
    this.#value = newValue;
    // invoke all registred dependencies/subscribers
    this.trigger();
  }
  get value() {
    return this.#value;
  }
  // bind a certain action with the change of the state
  #dependencies = [];
  register(callback) {
    this.#dependencies.push(callback);
  }
  destroy(action) {
    this.#dependencies = this.#dependencies.filter((fn) => fn !== action);
  }
  trigger() {
    for (const dep of this.#dependencies) dep();
  }
}

export class List extends State {
  Push(pushable) {
    this.value = [...this.value, pushable];
  }
  Remove(index) {
    this.value.splice(index, 1);
    this.value = this.value;
  }
  bind(parentNode, component) {
    if (!(this instanceof List))
      throw new Error("this doesn't implement interface List");

    this.value.forEach((e, i) => {
      parentNode.add(component(e.value, i));
    });

    this.register(() => {
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
      this.value.forEach((e, i) => {
        parentNode.add(component(e, i));
      });
    });
  }
}

export const ref = (defaultValue) => {
  return new State(defaultValue);
};

export const makelist = (defaultValue) => {
  return new List(defaultValue);
};
