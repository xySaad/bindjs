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

const contextMap = new WeakMap();

export class List extends State {
  #parentNode = null;
  #component = null;
  #idx = [];
  #synced = [];
  constructor(defaultValue = []) {
    super(defaultValue);
    this.value.forEach((_, i) => this.#idx.push(ref(i)));
  }
  push(pushable, shouldProxy = true) {
    const ctx = {};
    const px = shouldProxy
      ? new Proxy(pushable, {
          get(target, prop) {
            return target[prop];
          },
          set: (target, prop, newValue) => {
            target[prop] = newValue;
            this.trigger();
            for (const { list: subList } of this.#synced) subList.trigger();
            const boundCtx = contextMap.get(target) || ctx;
            if (prop in boundCtx && boundCtx[prop].value !== newValue) {
              boundCtx[prop].value = newValue;
            }
            return true;
          },
        })
      : pushable;

    if (shouldProxy) contextMap.set(px, ctx);

    for (const { list: subList, filter } of this.#synced) {
      if (!filter || filter(px)) subList.push(px, false);
    }
    const refIdx = ref(this.value.length);
    this.#idx.push(refIdx);
    if (this.#parentNode) {
      const elm = this.#component(px, refIdx, ctx);
      // use append instead of add to not trigger onAppend
      this.#parentNode.append(elm);
      elm.onAppend?.();
    }
    this.value.push(px);
    this.trigger();
  }
  remove(index) {
    for (const { list: subList } of this.#synced) {
      const itemToRemove = this.value[index];
      const indexToRemove = subList.value.indexOf(itemToRemove);
      subList.remove(indexToRemove);
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
  derive(filter) {
    const derivedList = new List(this.value);
    derivedList.#synced.push({ list: this, filter });
    return derivedList;
  }
  purge(predicate) {
    for (let i = 0; i < this.value.length; ) {
      if (predicate(this.value[i])) {
        this.remove(i);
      } else {
        i++;
      }
    }
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
    this.value.forEach((item, i) => {
      const ctx = contextMap.get(item) || {};

      const child = component(item, this.#idx[i], ctx);
      parentNode.append(child);
      child.onAppend?.();
    });
  }
}

export const state = (defaultValue) => {
  return new State(defaultValue);
};

export const list = (defaultValue) => {
  return new List(defaultValue);
};
