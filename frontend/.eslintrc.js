module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  settings: { react: { version: "detect" } },
  env: { browser: true, es2021: true },
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "import/extensions": ["error", "never", { ts: "never", tsx: "never" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["warn"],
      },
    },
  ],
};
