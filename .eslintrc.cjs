module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["**/dist/**", ".pages/**", ".yarn/**", "**/docs/**"],
  rules: {
    // Dynamic adapters and educational generic protocols deliberately use any.
    // Enforce runtime behavior through build and regression tests rather than a blanket type-style ban.
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/ban-types": [
      "error",
      { extendDefaults: true, types: { Function: false, "{}": false } },
    ],
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
};
