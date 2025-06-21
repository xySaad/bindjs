export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = location.pathname;
    //   this.defaultPath = "";
      this.onRouteChange = null
      
      window.addEventListener("DOMContentLoaded", () => this.TakeMe());
  }
    TakeMe() {
        let path =location.pathname
        let callback = this.routes.get(path)
        console.log(callback,path);
        
        if (!callback) {
          console.error("no callback for the route ",path);
            return     
        }
        document.body.innerHTML=""
         document.body.append(callback());
        if (this.onRouteChange) {
            this.onRouteChange(path)
        }
      
  }

  SetRoute(path, handler) {
    this.routes.set(path, handler);
    
  }
  navigate(path) {
    if (path != this.currentPath) {
      history.pushState({}, null, path);
      console.log(this.routes);
      this.TakeMe()
    }
  }
//   setDefaultPath(path) {
//     this.defaultPath = path;
//   }
    HandleChange() {
        if (this.onRouteChange != null) {
            this.onRouteChange()            
        }
    }
}

export function Routes() {
  return new Router();
}

// export function setRoute(path, component) {
//     // const routeWithoutSlash = path.trim("/");
//     console.log(path );
//     history.pushState({}, null, path)
//     console.log(history);
//     TakeMe(path)
// }

// const TakeMe = (path) => {
//     history.pushState({}, null, path)

//     // history.go(path)
// }
