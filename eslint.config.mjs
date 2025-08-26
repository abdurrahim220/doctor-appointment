import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...global.node,
        ...global.browser,
      },
    },
  },
  {
    rules: {
      eqeqeq: "off",
      "no-console": "warn",
      "no-unused-vars": "error",
      "no-undef": "warn",
      "prefer-const": [
        "error",
        {
          ignoreReadBeforeAssign: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [".env", "node_modules", "**/dist/"],
  },
);
