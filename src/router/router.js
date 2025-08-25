import { createElement } from "../core/createElement.js";
import { state } from "../core/state.js";

export class Router {
  #dependecies = [];
  constructor() {
    this.routes = new Map();
    this.path = state(location.pathname);

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
      elm.mount();
    }
    for (const dep of this.#dependecies) dep();
  }
  /**
   * @deprecated Use `setup()` instead for registering routes.
   */
  SetRoute(path, handler) {
    this.routes.set(path, handler);
  }

  setup(routes) {
    for (const key in routes) {
      this.routes.set(key, routes[key]);
    }
    this.render();
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
