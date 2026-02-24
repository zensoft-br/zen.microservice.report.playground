import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    files: ["**/*.{cjs,js,jsx,mjs}"],
    plugins: {
      "@stylistic": stylistic,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // "no-unused-vars": [
      //   "warn",
      //   {
      //     argsIgnorePattern: "^_",
      //     varsIgnorePattern: "^_",
      //     caughtErrorsIgnorePattern: "^_",
      //   },
      // ],
      // Formatting (Stylistic) rules
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
    },
  },
];
