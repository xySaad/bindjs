import html from "../html/index.js";
const { div } = html;

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = location.pathname;
    window.addEventListener("DOMContentLoaded", () => {
      this.render();
    });
  }

  render() {
    let path = location.pathname;
    let callback = this.routes.get(path);

    if (!callback) {
      console.error("no callback for the route ", path);
      callback = () => div({ textContent: "404" });
      return;
    }
    document.body.innerHTML = "";
    const elm = callback()
    document.body.append(elm);
    elm.onAppend()
  }

  SetRoute(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path) {
    if (path != this.currentPath) {
      history.pushState({}, null, path);
      this.currentPath = location.pathname;
      this.render();
    }
  }
}
export const router = new Router();
