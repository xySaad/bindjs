import { State } from "../index.js";
import { ref } from "./reference.js";

const proxiesCache = new WeakMap()
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
  push(item) {
    this.value.push(item);
    const refIdx = ref(this.value.length - 1);
    this.#idx.push(refIdx);
    for (const { end, callback } of this.#DOMLists) {
      const child = callback(item, refIdx);
      end.before(child);
      child.onAppend?.();
    }
    for (const list of this.#computedLists) list.pushFromSrc(item, refIdx());
    this.trigger();
    return refIdx;
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
    const filteredItems = [];
    super(filteredItems);
    this.#filter = filter;

    for (let i = 0; i < originalList.value.length; i++) {
      const item = originalList.value[i];
      if (filter(item)) {
        const refIdx = super.push(item);
        this.#mirroredRefIdx[i] = refIdx;
      } else {
        this.#mirroredRefIdx[i] = null;
      }
    }
  }

  pushFromSrc(item, srcIdx) {
    let refIdx = null;
    if (this.#filter(item)) {
      refIdx = super.push(item);
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
