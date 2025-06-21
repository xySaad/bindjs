import { AddRoute } from "./src/index.js";

import { App } from "./app/App.js";

AddRoute("/", App);
AddRoute("/active", App);
AddRoute("/completed", App);
