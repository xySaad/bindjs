import { state, State } from "../core/state.js";
import { ref } from "./reference.js";

const proxyCache = new WeakMap();
export class BetterList extends State {
  #computedLists = [];
  #DOMLists = [];
  #idx = [];
  constructor(defaultValue) {
    super([]);
    this.#batching = true;
    this.push(...defaultValue);
    this.#batching = false;
  }

  #batching = false;
  #triggerRequested = false;
  trigger() {
    if (this.#batching) {
      this.#triggerRequested = true;
      return;
    }
    super.trigger();
    console.error("trigger ran");
  }
  batch(callback) {
    this.#batching = true;
    callback();
    this.#batching = false;
    if (this.#triggerRequested) {
      this.trigger();
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
    item.$ = new Proxy(
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
      const children = items.map((item, i) => callback(item, this.#idx[i]));
      const frag = document.createDocumentFragment();
      frag.append(...children);
      end.before(frag);
      oldChildren.push(...children);
      for (const child of children) child.mount();
    }

    this.trigger();
    return this.#idx.slice(start);
  }

  remove(...indices) {
    indices = indices.sort((a, b) => a - b);
    const removeSet = new Set(indices);
    const newValue = [];
    const newIdx = [];

    for (let i = 0, j = 0; i < this.value.length; i++) {
      if (removeSet.has(i)) continue;
      newValue.push(this.value[i]);
      this.#idx[i](j++);
      newIdx.push(this.#idx[i]);
    }

    // DOM
    for (const { children } of this.#DOMLists) {
      for (const idx of indices) {
        children[idx].remove();
      }
      const kept = [];
      for (let i = 0; i < children.length; i++) {
        if (!removeSet.has(i)) kept.push(children[i]);
      }
      children.length = 0;
      children.push(...kept);
    }

    // computed lists
    for (const list of this.#computedLists) {
      list.removeBySrcIndex(...indices);
    }

    this.#idx = newIdx;
    this.value = newValue; // runs trigger
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
    const indices = [];
    for (let i = 0; i < this.value.length; i++) {
      if (predicate(this.value[i], i)) {
        indices.push(i);
      }
    }
    this.remove(...indices);
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

    for (const { callback, children, end } of this.#DOMLists) {
      const child = callback(proxiedItem, refIdx);
      (children[index] || end).before(child);
      children.splice(index, 0, child);
      child.mount();
    }
    this.trigger();
    return refIdx;
  }
  clear() {
    for (const { children, start, end } of this.#DOMLists) {
      const range = document.createRange();
      range.setStartAfter(start);
      range.setEndBefore(end);
      range.deleteContents();
      children.length = 0;
    }

    for (const list of this.#computedLists) {
      list.clear();
    }

    this.value = [];
    this.#idx = [];
  }
  set(index, item) {
    if (index < 0 || index >= this.value.length) {
      throw new Error(`Index ${index} is out of bounds`);
    }

    const refIdx = this.#idx[index];
    const proxiedItem = this.#getProxy(item, refIdx);
    this.value[index] = proxiedItem;

    for (const { callback, children, start, end } of this.#DOMLists) {
      const oldChild = children[index];
      const newChild = callback(proxiedItem, refIdx);
      oldChild.replaceWith(newChild);
      children[index] = newChild;
      newChild.mount();
    }

    for (const list of this.#computedLists) {
      list.reEvaluate(proxiedItem, refIdx());
      list.trigger();
    }

    this.trigger();
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
  // vibe coded with Grok (i am lazy to review)
  removeBySrcIndex(...indices) {
    // Normalize indices: handle array or spread, remove duplicates, filter invalid, sort descending
    const validIndices = Array.isArray(indices[0]) ? indices[0] : indices;
    const indicesToRemove = [...new Set(validIndices)]
      .filter(
        (i) => Number.isInteger(i) && i >= 0 && i < this.#mirroredRefIdx.length
      )
      .sort((a, b) => b - a);

    if (!indicesToRemove.length) return;

    // Collect valid mirrored indices
    const mirroredIndices = indicesToRemove
      .map((index) => this.#mirroredRefIdx[index])
      .filter((refIdx, i) => {
        if (refIdx == null) {
          console.warn(
            `No refIdx at source index ${indicesToRemove[i]} in DerivedList`
          );
          return false;
        }
        return true;
      })
      .map((refIdx) => refIdx());

    // Batch remove from mirroredRefIdx
    for (const index of indicesToRemove) {
      try {
        this.#mirroredRefIdx.splice(index, 1);
      } catch (e) {
        console.error(
          `Failed to splice index ${index} from mirroredRefIdx:`,
          e
        );
      }
    }

    // Remove from derived list
    if (mirroredIndices.length) {
      try {
        this.remove(...mirroredIndices);
      } catch (e) {
        console.error(`Failed to remove indices from derived list:`, e);
      }
    }
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
    this.batch(() => {
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
    });
  }
}

export const list = (defaultValue) => {
  return new BetterList(defaultValue);
};
