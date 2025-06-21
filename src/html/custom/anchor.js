import { router } from "../../router/router.js";
import html from "../index.js";

export const A = (className, href, label) =>
  html.a({
    class: className,
    href,
    textContent: label,
    onclick: (e) => {
      e.preventDefault();
      router.navigate(href);
    },
  });
