/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
module.exports = {
  extends: "../../config/eslint.js",
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.browser.json', './tsconfig.eslint.json']
  },
  rules: {
  },
  overrides: [
    {
      files: ['test/**/*.ts'],
      rules: {
        'implicit-dependencies/no-implicit': [
          'error',
          { peer: false, dev: true, optional: false },
        ],
      },
    },
  ],
  ignorePatterns: ['webpack.config.js']
}
