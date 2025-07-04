// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { sha256, BN } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
const assert = require('assert')

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  const gasUsed = new BN(opts._common.param('gasPrices', 'sha256'))
  gasUsed.iadd(
    new BN(opts._common.param('gasPrices', 'sha256Word')).imuln(Math.ceil(data.length / 32))
  )

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: sha256(data),
  }
}
