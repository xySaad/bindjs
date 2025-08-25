import { state, State } from "../core/state.js";
import { ref } from "./reference.js";

const proxyCache = new WeakMap();
export class BetterList extends State {
  #computedLists = [];
  #DOMLists = [];
  #idx = [];
  constructor(defaultValue) {
    super([]);
    this.push(...defaultValue);
  }

  #batching = false;
  #triggerRequested = false;
  trigger() {
    if (this.#batching) {
      this.#triggerRequested = true;
      return;
    }
    super.trigger();
  }
  #beginBatch() {
    this.#batching = true;
  }

  #endBatch() {
    this.#batching = false;
    if (this.#triggerRequested) {
      super.trigger();
      this.#triggerRequested = false;
    }
  }

  filter(predicate) {
    const computedList = new DerivedList(this, predicate);
    this.#computedLists.push(computedList);
    return computedList;
  }
  #getProxy(item, refIdx) {
    const isProxy = proxyCache.get(item);

    if (isProxy || typeof item !== "object") return item;
    const ctx = {};

    const proxiedItem = new Proxy(item, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (prop in ctx && ctx[prop].value !== value) ctx[prop].value = value;
        this.trigger();
        for (const list of this.#computedLists) {
          list.reEvaluate(proxiedItem, refIdx());
          list.trigger();
        }
        return true;
      },
    });
    proxiedItem.$ = new Proxy(
      {},
      {
        get(_, prop) {
          if (prop in ctx) return ctx[prop];
          const st = state(proxiedItem[prop]);
          st.register((v) => (proxiedItem[prop] = v));
          ctx[prop] = st;
          return st;
        },
      }
    );
    proxyCache.set(proxiedItem, true);

    return proxiedItem;
  }
  push(...items) {
    const start = this.#idx.length;

    for (const item of items) {
      const refIdx = ref(this.value.length);
      const proxiedItem = this.#getProxy(item, refIdx);
      this.value.push(proxiedItem);
      this.#idx.push(refIdx);

      for (const list of this.#computedLists)
        list.pushFromSrc(proxiedItem, refIdx());
    }

    for (const { end, callback, children: oldChildren } of this.#DOMLists) {
      const children = items.map(callback);
      end.before(...children);
      oldChildren.push(...children);
      for (const child of children) child.mount();
    }

    this.trigger();
    return this.#idx.slice(start);
  }

  remove(index) {
    for (const { children } of this.#DOMLists) {
      children[index].remove();
      children.splice(index, 1);
      console.log(index);
      console.log(...children);
    }
    this.value.splice(index, 1);
    this.#idx.splice(index, 1);
    for (let i = index; i < this.#idx.length; i++) {
      const refIdx = this.#idx[i];
      refIdx((prev) => prev - 1);
    }
    for (const list of this.#computedLists) list.removeBySrcIndex(index);

    this.trigger();
  }
  map(callback) {
    const children = this.value.map((item, i) => callback(item, this.#idx[i]));

    const start = document.createTextNode("");
    const end = document.createTextNode("");
    this.#DOMLists.push({ start, end, callback, children });

    const frag = document.createDocumentFragment();
    frag.append(start, ...children, end);
    frag.mount = () => {
      for (const child of children) child.mount();
    };
    return frag;
  }
  purge(predicate) {
    this.#beginBatch();
    for (let i = 0; i < this.value.length; ) {
      if (predicate(this.value[i], i)) {
        this.remove(i);
      } else {
        i++;
      }
    }
    this.#endBatch();
  }
  insert(item, index) {
    const refIdx = ref(index);
    const proxiedItem = this.#getProxy(item, refIdx);
    this.value.splice(index, 0, proxiedItem);
    this.#idx.splice(index, 0, refIdx);

    for (let i = index + 1; i < this.#idx.length; i++) {
      const refIdx = this.#idx[i];
      refIdx((prev) => prev + 1);
    }

    for (const { start, callback, children } of this.#DOMLists) {
      const child = callback(proxiedItem, refIdx);
      (children[index] || start).after(child);
      children.splice(index, 0, child);
      child.mount();
    }
    this.trigger();
    return refIdx;
  }
}

export class DerivedList extends BetterList {
  #filter = null;
  #mirroredRefIdx = [];
  #originalList = [];
  constructor(originalList, filter) {
    super([]);
    this.#filter = filter;
    this.#originalList = originalList;

    const filteredItems = [];
    const srcIndexForItem = [];

    originalList.value.forEach((item, i) => {
      if (filter(item)) {
        filteredItems.push(item);
        srcIndexForItem.push(i);
      }
    });

    this.#mirroredRefIdx = Array(originalList.value.length).fill(null);
    const refIdxArray = super.push(...filteredItems);

    refIdxArray.forEach((refIdx, i) => {
      const srcIdx = srcIndexForItem[i];
      this.#mirroredRefIdx[srcIdx] = refIdx;
    });
  }

  pushFromSrc(item, srcIdx) {
    let refIdx = null;
    if (this.#filter(item)) {
      [refIdx] = super.push(item);
    }
    this.#mirroredRefIdx[srcIdx] = refIdx;
  }

  removeBySrcIndex(index) {
    const refIdx = this.#mirroredRefIdx[index];
    if (refIdx != null) {
      this.remove(refIdx());
    }
    this.#mirroredRefIdx.splice(index, 1);
  }
  reEvaluate(item, srcIdx) {
    if (!this.#filter(item)) {
      const refIdx = this.#mirroredRefIdx[srcIdx];
      if (refIdx != null) {
        this.remove(refIdx());
        this.#mirroredRefIdx[srcIdx] = null;
      }
    }
  }
  refine(newFilter) {
    const original = this.#originalList.value;
    this.#filter = newFilter;

    let position = 0;

    for (let i = 0; i < original.length; i++) {
      const item = original[i];
      const shouldInclude = newFilter(item);
      const wasIncluded = this.#mirroredRefIdx[i] !== null;

      if (shouldInclude) {
        if (!wasIncluded) {
          const ref = super.insert(item, position);
          this.#mirroredRefIdx[i] = ref;
        }
        position++;
      } else {
        if (wasIncluded) {
          const refIdx = this.#mirroredRefIdx[i];
          super.remove(refIdx());
          this.#mirroredRefIdx[i] = null;
        }
      }
    }
  }
}

export const list = (defaultValue) => {
  return new BetterList(defaultValue);
};
