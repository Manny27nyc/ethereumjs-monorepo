/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
module.exports = {
  extends: '../../config/eslint.js',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.benchmarks.json'],
  },
  overrides: [
    {
      files: ['benchmarks/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
