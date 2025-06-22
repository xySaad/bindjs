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

export class List extends State {
  #parentNode = null;
  #component = null;

  push(pushable) {
    this.#parentNode.add(this.#component(pushable, this.value.length));
    this.value.push(pushable);
    this.trigger();
  }
  remove(index) {
    this.value.splice(index, 1);
    this.#parentNode.children[index].remove();

    // Rebind indexes for remaining items
    for (let i = index; i < this.#parentNode.children.length; i++) {
      const item = this.value[i];
      const newNode = this.#component(item, i);
      this.#parentNode.children[i].replaceWith(newNode);
    }
    this.trigger();
  }

  // TODO: change name to map.
  // use comment/textNode closures (start/end) instead of relying on the parent
  bind(parentNode, component) {
    if (!(this instanceof List))
      throw new Error("this doesn't implement interface List");
    this.#parentNode = parentNode;
    this.#component = component;

    this.value.forEach((item, i) => {
      parentNode.add(component(item, i));
    });

    this.register(() => {
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
      this.value.forEach((item, i) => {
        parentNode.add(component(item, i));
      });
    });
  }
}

export const ref = (defaultValue) => {
  if (Array.isArray(defaultValue)) {
    return new List(defaultValue);
  }
  return new State(defaultValue);
};
