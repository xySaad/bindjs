export class Reference {
  #value = null;
  #triggers = [];
  constructor(defaultValue) {
    this.#value = defaultValue;
  }

  onUpdate(action) {
    this.#triggers.push(action);
  }
  get value() {
    return this.#value;
  }
  set value(newValue) {
    this.#value = newValue;
    this.#triggers.forEach((e) => {
      e();
    });
  }
}

export const ref = (defaultValue) => {
  return new Reference(defaultValue);
};
