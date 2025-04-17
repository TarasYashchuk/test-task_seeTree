module.exports = {
  env: { node: true, es2021: true, jest: true },
  extends: ['airbnb-base', 'plugin:import/errors', 'plugin:import/warnings', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: { ecmaVersion: 12, sourceType: 'module' },
  rules: { 'import/extensions': ['error', 'ignorePackages', { ts: 'never' }] },
  settings: { 'import/resolver': { typescript: {} } }
};
