import { defineConfig } from "eslint/config";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";

export default defineConfig([{
    plugins: {
        import: fixupPluginRules(_import),
    },

    rules: {
        "import/no-cycle": ["error", {
            maxDepth: 20,
        }],
    },
}]);