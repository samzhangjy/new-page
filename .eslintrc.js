module.exports = {
  extends: [
    'mantine',
    'plugin:@next/next/recommended',
  ],
  plugins: [],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
