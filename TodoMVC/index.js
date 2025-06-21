import { App } from "./app/App.js";
import { router } from "./src/index.js";
router.SetRoute("/", App);
router.SetRoute("/completed", App);
router.SetRoute("/active", App);
