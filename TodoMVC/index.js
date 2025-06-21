import { router } from "../src/router.js";
import { App } from "./app/App.js";

router.SetRoute("/", App);
router.SetRoute("/completed", App);
router.SetRoute("/active", App);
