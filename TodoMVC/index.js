import { Routes } from "../src/router.js";
import { App } from "./app/App.js";

let router = Routes();
// window.addEventListener("DOMContentLoaded", () => {
//   router.navigate("/")  
// });
// router.setDefaultPath("/");

router.SetRoute("/TodoMVC/", App);

router.SetRoute("/completed", App);
router.SetRoute("/active", App);
