import { createElement } from "../core/createElement.js";
import { tags } from "./tags.js";

/** @type {import('../types').HtmlElements} */
const html = {};
for (const tag of tags) {
  html[tag] = (attrs) => createElement(tag, attrs);
}

export default html;
