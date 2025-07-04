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
  trigger() {
    for (const dep of this.#dependencies) dep(this.#value);
  }
}


export const state = (defaultValue) => {
  return new State(defaultValue);
};