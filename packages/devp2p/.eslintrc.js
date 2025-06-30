// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json']
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    'no-redeclare': 'off',
    'no-undef': 'off' // temporary until fixed: 'NodeJS' is not defined
  }
}
