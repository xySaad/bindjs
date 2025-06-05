import { ce } from "./native.js";
import { tags } from "./tags.js";
/**
 * Factory functions for creating HTML elements.
 *
 * Each property is an HTML tag name, and the function
 * returns the corresponding HTMLElement type.
 *
 * @type { {
 *   [K in keyof HTMLElementTagNameMap]: (
 *     attributes?: Record<string, any>
 *   ) => HTMLElementTagNameMap[K]
 * } }
 */
const htmlElements = {};
for (const tag of tags) {
  htmlElements[tag] = (attrs) => ce(tag, attrs);
}

export default htmlElements;
