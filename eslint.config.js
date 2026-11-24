import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import checkFile from "eslint-plugin-check-file";
import tseslint from "typescript-eslint";
import { importX } from "eslint-plugin-import-x";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // unused variables are handled by TypeScript, so we can turn this off
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // shadcn files export components and helpers together
    files: ["src/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // enforce kebab-case for every file and folder inside src
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx}": "KEBAB_CASE" },
        // lets suffixes like `.test` pass (product-card.test.tsx)
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": ["error", { "src/**": "KEBAB_CASE" }],
    },
  },
  {
    // named exports only in app code; root config files keep export default
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "import-x": importX },
    rules: { "import-x/no-default-export": "error" },
  },
]);
