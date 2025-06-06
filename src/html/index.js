import { createBindElement } from "./native.js";
import { tags } from "./tags.js";

/** @type {import('../types').HtmlElements} */
const htmlElements = {};
for (const tag of tags) {
  htmlElements[tag] = (attrs) => createBindElement(tag, attrs);
}

export default htmlElements;
