import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions:{
        project: './tsconfig.json',
      }
    },
  },
  {
    rules: {
      eqeqeq: "off",
      "no-console": "warn",
      "no-unused-vars": "off",
      "no-undef": "warn",
      "prefer-const": [
        "error",
        {
          ignoreReadBeforeAssign: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
       }],
    },
  },
  {
    ignores: [".env", "node_modules", "**/dist/"],
  },
);
