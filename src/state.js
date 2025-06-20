export class State {
  #value = null;
  constructor(defaultValue) {
    this.#value = defaultValue;
  }
  set value(newValue) {
    this.#value = newValue;
    // invoke all registred dependencies/subscribers
    for (const dep of this.#dependencies) dep();
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
    this.#dependencies = this.#dependencies.filter((fn) => fn !== action)
  }
}

export class List extends State {
  Push(pushable) {
    this.value = [... this.value, pushable]
  }
  Remove(index) {
    this.value.splice(index, 1)
    this.value = this.value
  }
  // Set(i, prop, value) {
  //   this.value[i][prop] = value
  // }
}
export const ref = (defaultValue) => {
  return new State(defaultValue);
};
export const makelist = (defaultValue) => {
  return new List(defaultValue)
}