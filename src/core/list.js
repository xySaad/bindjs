import { State } from "../index.js";
import { ref } from "./reference.js";

export class BetterList extends State {
  #computedLists = [];
  #DOMLists = [];
  #idx = [];
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
    for (const list of this.#computedLists) list.push(item);
    this.trigger();
  }
  remove(index) {
    console.log(this.value, index);

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
    for (const list of this.#computedLists) list.remove(index);

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
      const refIdx = ref(i);
      this.#idx.push(refIdx);
      end.before(callback(item, refIdx));
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
}
export class DerivedList extends BetterList {
  #filter = null;
  constructor(originalList, filter) {
    super(originalList.value.filter(filter));
    this.#filter = filter;
  }
  push(item) {
    if (this.#filter(item)) super.push(item);
  }
}
