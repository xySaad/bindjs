import { createElement } from "../core/createElement.js";
import { state } from "../core/state.js";

export class Router {
  #dependecies = [];
  constructor() {
    this.routes = new Map();
    this.path = state(location.pathname);

    window.addEventListener("DOMContentLoaded", () => {
      this.render();
    });
    window.addEventListener("popstate", () => {
      this.navigate(location.pathname, true);
    });
  }

  render(prevPath) {
    let path = location.pathname;
    let callback = this.routes.get(path);

    if (!callback) {
      console.error("no callback for the route ", path);
      callback = () => createElement("h1", { textContent: "404" });
    }
    const prevCallback = this.routes.get(prevPath);
    if (callback !== prevCallback) {
      document.body.innerHTML = "";
      const elm = callback();
      document.body.append(elm);
      elm.onAppend();
    }
    for (const dep of this.#dependecies) dep();
  }

  SetRoute(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path, replace = false) {
    const prevPath = this.path.value;
    if (path !== prevPath) {
      if (!replace) history.pushState({}, null, path);
      this.path.value = path;
      this.render(prevPath);
    }
  }
  register(dep) {
    this.#dependecies.push(dep);
  }
}
export const router = new Router();
