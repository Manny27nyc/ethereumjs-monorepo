// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: [
    "src/**/!(secure|checkpointTrie|baseTrie|walkController).ts",
    "test/**/*.ts"
  ],
}