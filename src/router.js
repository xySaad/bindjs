import { div } from "./native.js";

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = location.pathname;

    this.onRouteChange = null;
    window.addEventListener("DOMContentLoaded", () => {
      this.TakeMe();
    });
  }
  TakeMe() {
    let path = location.pathname;
    let callback = this.routes.get(path);

    if (!callback) {
      console.error("no callback for the route ", path);
      callback = () => div({ textContent: "404" });
      return;
    }
    document.body.innerHTML = "";
    document.body.append(callback());
    if (this.onRouteChange) {
      this.onRouteChange(path);
    }
  }

  SetRoute(path, handler) {
    this.routes.set(path, handler);
  }
  navigate(path) {
    if (path != this.currentPath) {
      history.pushState({}, null, path);
      this.TakeMe();
    }
  }

  HandleChange() {
    if (this.onRouteChange != null) {
      this.onRouteChange();
    }
  }
}
export const router = new Router();
