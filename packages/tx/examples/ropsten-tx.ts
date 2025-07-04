// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { Transaction } from '../src'
import { toBuffer } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'

const txData = toBuffer(
  '0xf9010b82930284d09dc30083419ce0942d18de92e0f9aee1a29770c3b15c6cf8ac5498e580b8a42f43f4fb0000000000000000000000000000000000000000000000000000016b78998da900000000000000000000000000000000000000000000000000000000000cb1b70000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000001363e4f00000000000000000000000000000000000000000000000000000000000186a029a0fac36e66d329af0e831b2e61179b3ec8d7c7a8a2179e303cfed3364aff2bc3e4a07cb73d56e561ccbd838818dd3dea5fa0b5158577ffc61c0e6ec1f0ed55716891',
)

const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Petersburg })
const tx = Transaction.fromSerializedTx(txData, { common })

if (
  tx.validate() &&
  tx.getSenderAddress().toString() === '0x9dfd2d2b2ed960923f7bf2e8883d73f213f3b24b'
) {
  console.log('Correctly created the tx')
} else {
  console.error('Invalid tx')
}
