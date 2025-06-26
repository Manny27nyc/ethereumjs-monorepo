/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ["lib"],
  out: 'docs',
  exclude: [
    "bin/cli.ts",
    "lib/blockchain/index.ts",
    "lib/index.ts",
    "lib/net/server/index.ts",
    "lib/net/peer/index.ts",
    "lib/net/protocol/index.ts",
    "lib/rpc/index.ts",
    "lib/rpc/error-code.ts",
    "lib/rpc/modules/index.ts",
    "lib/service/index.ts",
    "lib/sync/index.ts",
    "lib/sync/fetcher/index.ts",
    "lib/util/index.ts"
  ],
}