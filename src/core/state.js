import { ref } from "./reference.js";

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
  #idx = [];
  synced = [];
  push(pushable) {
    for (const subList of this.synced) {
      subList.push(pushable);
    }
    const px = new Proxy(pushable, {
      get(target, prop) {
        return target[prop];
      },
      set: (target, prop, newValue) => {
        target[prop] = newValue;
        this.trigger();
        return true;
      },
    });
    const refIdx = ref(this.value.length);
    this.#idx.push(refIdx);
    this.#parentNode?.add(this.#component(px, refIdx));
    this.value.push(px);
    this.trigger();
  }
  remove(index) {
    for (const subList of this.synced) {
      subList.remove(subList.value.indexOf(this.value[index]));
    }
    this.value.splice(index, 1);
    this.#idx.splice(index, 1);
    this.#parentNode?.children[index].remove();
    for (let i = index; i < this.#idx.length; i++) {
      const idxRef = this.#idx[i];
      idxRef((prev) => prev - 1);
    }
    this.trigger();
  }

  // TODO: change name to map.
  // use comment/textNode closures (start/end) instead of relying on the parent
  // and create a list for each call of .map
  // stop relying on global #idx and #parentNode, each map has it's own shit
  bind(parentNode, component) {
    if (!(this instanceof List))
      throw new Error("this doesn't implement interface List");
    this.#parentNode = parentNode;
    this.#component = component;
    //reset idx cause only one parent is supported
    this.#idx = [];
    this.value.forEach((item, i) => {
      const refIdx = ref(i);
      this.#idx.push(refIdx);
      parentNode.add(component(item, refIdx));
    });
  }
}

export const state = (defaultValue) => {
  return new State(defaultValue);
};

export const list = (defaultValue) => {
  return new List(defaultValue);
};
