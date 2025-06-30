// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { Address, BN } from 'ethereumjs-util'

export default class TxContext {
  gasPrice: BN
  origin: Address

  constructor(gasPrice: BN, origin: Address) {
    this.gasPrice = gasPrice
    this.origin = origin
  }
}
