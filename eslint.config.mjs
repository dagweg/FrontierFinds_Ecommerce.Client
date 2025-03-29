export default [];
// import eslintRecommended from "eslint/conf/eslint-recommended";
// import reactPlugin from "eslint-plugin-react";
// import prettierPlugin from "eslint-plugin-prettier";
// import prettierConfig from "eslint-config-prettier";

// export default [
//   {
//     files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"], // Apply to all JS/TS files
//     ...eslintRecommended, // Spread eslint:recommended rules
//     plugins: {
//       react: reactPlugin,
//       prettier: prettierPlugin,
//     },
//     settings: {
//       react: {
//         version: "detect",
//       },
//     },
//     languageOptions: {
//       parserOptions: {
//         ecmaVersion: "latest",
//         sourceType: "module",
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//     },
//     rules: {
//       ...prettierPlugin.configs.recommended.rules, // Spread prettier rules
//       "prettier/prettier": "error",
//       "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "always" }],
//       "react/jsx-wrap-multilines": [
//         "error",
//         {
//           declaration: "parens-new-line",
//           assignment: "parens-new-line",
//           return: "parens-new-line",
//           arrow: "parens-new-line",
//           condition: "parens-new-line",
//           logical: "parens-new-line",
//           prop: "parens-new-line",
//         },
//       ],
//       "react/react-in-jsx-scope": "off",
//       ...reactPlugin.configs.recommended.rules, // spread react recommended rules.
//     },
//   },
//   {
//     ...prettierConfig, // Disable rules that conflict with prettier.
//   },
// ];
