import parser from "@typescript-eslint/parser";
import typescript from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  { ignores: ["**/dist/**", ".pages/**", ".yarn/**", "**/docs/**"] },
  {
    files: ["**/*.ts"],
    languageOptions: { parser, ecmaVersion: "latest", sourceType: "module" },
    plugins: { "@typescript-eslint": typescript, prettier },
    rules: {
      ...typescript.configs.recommended.rules,
      ...prettierConfig.rules,
      // Dynamic adapters and educational generic protocols deliberately use any.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "prettier/prettier": "error",
    },
  },
];
