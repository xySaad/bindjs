import { state, State } from "../index.js";
import { ref } from "./reference.js";

const proxyCache = new WeakMap();
export class BetterList extends State {
  #computedLists = [];
  #DOMLists = [];
  #idx = [];
  constructor(defaultValue) {
    super(defaultValue);
    this.#idx = defaultValue.map((_, i) => ref(i));
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
  #getProxy(item) {
    const isProxy = proxyCache.get(item);

    if (isProxy) return item;
    const ctx = {};

    const proxiedItem = new Proxy(item, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (prop in ctx && ctx[prop].value !== value) ctx[prop].value = value;
        this.trigger();
        for (const list of this.#computedLists) list.trigger();
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
    const refIndices = [];
    const children = Array(this.#DOMLists.length).fill(Array(items.length));

    for (const [itemIdx, item] of items.entries()) {
      const proxiedItem = this.#getProxy(item);
      this.value.push(proxiedItem);
      const refIdx = ref(this.value.length - 1);
      refIndices.push(refIdx);
      this.#idx.push(refIdx);
      for (const [listIdx, { callback }] of this.#DOMLists.entries()) {
        children[listIdx][itemIdx] = callback(proxiedItem, refIdx);
      }
      for (const list of this.#computedLists)
        list.pushFromSrc(proxiedItem, refIdx());
    }
    for (const [listIdx, { end }] of this.#DOMLists.entries()) {
      end.before(...children[listIdx]);
      children[listIdx].forEach((child) => child.onAppend?.());
    }
    this.trigger();
    return refIndices;
  }
  remove(index) {
    for (const { start, end, callback } of this.#DOMLists) {
      let next = start.nextSibling;
      let count = 0;
      while (count < index) {
        next = next.nextSibling;
        count++;
      }
      next.remove();
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
    const start = document.createComment("start");
    const end = document.createComment("end");
    const frag = document.createDocumentFragment();
    frag.append(start, end);
    this.#DOMLists.push({ start, end, callback });
    for (let i = 0; i < this.value.length; i++) {
      const item = this.value[i];
      end.before(callback(item, this.#idx[i]));
    }

    frag.onAppend = () => {
      let next = start.nextSibling;
      while (true) {
        if (next === end) break;
        next.onAppend?.();
        next = next.nextSibling;
      }
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
}

export class DerivedList extends BetterList {
  #filter = null;
  #mirroredRefIdx = [];

  constructor(originalList, filter) {
    super([]);
    this.#filter = filter;

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
}
