// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: [
    'tests/**/*.ts',
    'src/bloom/*.ts',
    'src/evm/**',
    'src/state/cache.ts',
  ],
}