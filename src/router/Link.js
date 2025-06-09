import html from "../html/index.js";
import { go } from "./index.js";
export const Link = (href, label, className = "") =>
  html.a({
    href,
    class: className,
    textContent: label,
    onclick: (e) => {
      e.preventDefault();
      go(href);
    },
  });
