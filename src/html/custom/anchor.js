import { createElement } from "../../core/createElement.js";
import { router } from "../../router/router.js";

export const A = (className, href, label) =>
  createElement("a", {
    class: className,
    href,
    textContent: label,
    onclick: (e) => {
      e.preventDefault();
      router.navigate(href);
    },
  });
