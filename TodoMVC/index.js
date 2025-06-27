import { App } from "./app/App.js";
import { router } from "rbind";
router.SetRoute("/", App);
router.SetRoute("/completed", App);
router.SetRoute("/active", App);
