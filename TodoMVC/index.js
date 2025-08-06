import { App } from "./app/App.js";
import { router } from "rbind";

router.setup({ "/": App, "/completed": App, "/active": App });
