// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import Common from '@ethereumjs/common'
import { getFullname } from './util'

export class Opcode {
  readonly code: number
  readonly name: string
  readonly fullName: string
  readonly fee: number
  readonly isAsync: boolean

  constructor({
    code,
    name,
    fullName,
    fee,
    isAsync,
  }: {
    code: number
    name: string
    fullName: string
    fee: number
    isAsync: boolean
  }) {
    this.code = code
    this.name = name
    this.fullName = fullName
    this.fee = fee
    this.isAsync = isAsync

    // Opcode isn't subject to change, thus all futher modifications are prevented.
    Object.freeze(this)
  }
}

export type OpcodeList = Map<number, Opcode>

// Base opcode list. The opcode list is extended in future hardforks
const opcodes = {
  // 0x0 range - arithmetic ops
  // name, async
  0x00: { name: 'STOP', isAsync: false },
  0x01: { name: 'ADD', isAsync: false },
  0x02: { name: 'MUL', isAsync: false },
  0x03: { name: 'SUB', isAsync: false },
  0x04: { name: 'DIV', isAsync: false },
  0x05: { name: 'SDIV', isAsync: false },
  0x06: { name: 'MOD', isAsync: false },
  0x07: { name: 'SMOD', isAsync: false },
  0x08: { name: 'ADDMOD', isAsync: false },
  0x09: { name: 'MULMOD', isAsync: false },
  0x0a: { name: 'EXP', isAsync: false },
  0x0b: { name: 'SIGNEXTEND', isAsync: false },

  // 0x10 range - bit ops
  0x10: { name: 'LT', isAsync: false },
  0x11: { name: 'GT', isAsync: false },
  0x12: { name: 'SLT', isAsync: false },
  0x13: { name: 'SGT', isAsync: false },
  0x14: { name: 'EQ', isAsync: false },
  0x15: { name: 'ISZERO', isAsync: false },
  0x16: { name: 'AND', isAsync: false },
  0x17: { name: 'OR', isAsync: false },
  0x18: { name: 'XOR', isAsync: false },
  0x19: { name: 'NOT', isAsync: false },
  0x1a: { name: 'BYTE', isAsync: false },

  // 0x20 range - crypto
  0x20: { name: 'SHA3', isAsync: false },

  // 0x30 range - closure state
  0x30: { name: 'ADDRESS', isAsync: true },
  0x31: { name: 'BALANCE', isAsync: true },
  0x32: { name: 'ORIGIN', isAsync: true },
  0x33: { name: 'CALLER', isAsync: true },
  0x34: { name: 'CALLVALUE', isAsync: true },
  0x35: { name: 'CALLDATALOAD', isAsync: true },
  0x36: { name: 'CALLDATASIZE', isAsync: true },
  0x37: { name: 'CALLDATACOPY', isAsync: true },
  0x38: { name: 'CODESIZE', isAsync: false },
  0x39: { name: 'CODECOPY', isAsync: false },
  0x3a: { name: 'GASPRICE', isAsync: false },
  0x3b: { name: 'EXTCODESIZE', isAsync: true },
  0x3c: { name: 'EXTCODECOPY', isAsync: true },

  // '0x40' range - block operations
  0x40: { name: 'BLOCKHASH', isAsync: true },
  0x41: { name: 'COINBASE', isAsync: true },
  0x42: { name: 'TIMESTAMP', isAsync: true },
  0x43: { name: 'NUMBER', isAsync: true },
  0x44: { name: 'DIFFICULTY', isAsync: true },
  0x45: { name: 'GASLIMIT', isAsync: true },

  // 0x50 range - 'storage' and execution
  0x50: { name: 'POP', isAsync: false },
  0x51: { name: 'MLOAD', isAsync: false },
  0x52: { name: 'MSTORE', isAsync: false },
  0x53: { name: 'MSTORE8', isAsync: false },
  0x54: { name: 'SLOAD', isAsync: true },
  0x55: { name: 'SSTORE', isAsync: true },
  0x56: { name: 'JUMP', isAsync: false },
  0x57: { name: 'JUMPI', isAsync: false },
  0x58: { name: 'PC', isAsync: false },
  0x59: { name: 'MSIZE', isAsync: false },
  0x5a: { name: 'GAS', isAsync: false },
  0x5b: { name: 'JUMPDEST', isAsync: false },

  // 0x60, range
  0x60: { name: 'PUSH', isAsync: false },
  0x61: { name: 'PUSH', isAsync: false },
  0x62: { name: 'PUSH', isAsync: false },
  0x63: { name: 'PUSH', isAsync: false },
  0x64: { name: 'PUSH', isAsync: false },
  0x65: { name: 'PUSH', isAsync: false },
  0x66: { name: 'PUSH', isAsync: false },
  0x67: { name: 'PUSH', isAsync: false },
  0x68: { name: 'PUSH', isAsync: false },
  0x69: { name: 'PUSH', isAsync: false },
  0x6a: { name: 'PUSH', isAsync: false },
  0x6b: { name: 'PUSH', isAsync: false },
  0x6c: { name: 'PUSH', isAsync: false },
  0x6d: { name: 'PUSH', isAsync: false },
  0x6e: { name: 'PUSH', isAsync: false },
  0x6f: { name: 'PUSH', isAsync: false },
  0x70: { name: 'PUSH', isAsync: false },
  0x71: { name: 'PUSH', isAsync: false },
  0x72: { name: 'PUSH', isAsync: false },
  0x73: { name: 'PUSH', isAsync: false },
  0x74: { name: 'PUSH', isAsync: false },
  0x75: { name: 'PUSH', isAsync: false },
  0x76: { name: 'PUSH', isAsync: false },
  0x77: { name: 'PUSH', isAsync: false },
  0x78: { name: 'PUSH', isAsync: false },
  0x79: { name: 'PUSH', isAsync: false },
  0x7a: { name: 'PUSH', isAsync: false },
  0x7b: { name: 'PUSH', isAsync: false },
  0x7c: { name: 'PUSH', isAsync: false },
  0x7d: { name: 'PUSH', isAsync: false },
  0x7e: { name: 'PUSH', isAsync: false },
  0x7f: { name: 'PUSH', isAsync: false },

  0x80: { name: 'DUP', isAsync: false },
  0x81: { name: 'DUP', isAsync: false },
  0x82: { name: 'DUP', isAsync: false },
  0x83: { name: 'DUP', isAsync: false },
  0x84: { name: 'DUP', isAsync: false },
  0x85: { name: 'DUP', isAsync: false },
  0x86: { name: 'DUP', isAsync: false },
  0x87: { name: 'DUP', isAsync: false },
  0x88: { name: 'DUP', isAsync: false },
  0x89: { name: 'DUP', isAsync: false },
  0x8a: { name: 'DUP', isAsync: false },
  0x8b: { name: 'DUP', isAsync: false },
  0x8c: { name: 'DUP', isAsync: false },
  0x8d: { name: 'DUP', isAsync: false },
  0x8e: { name: 'DUP', isAsync: false },
  0x8f: { name: 'DUP', isAsync: false },

  0x90: { name: 'SWAP', isAsync: false },
  0x91: { name: 'SWAP', isAsync: false },
  0x92: { name: 'SWAP', isAsync: false },
  0x93: { name: 'SWAP', isAsync: false },
  0x94: { name: 'SWAP', isAsync: false },
  0x95: { name: 'SWAP', isAsync: false },
  0x96: { name: 'SWAP', isAsync: false },
  0x97: { name: 'SWAP', isAsync: false },
  0x98: { name: 'SWAP', isAsync: false },
  0x99: { name: 'SWAP', isAsync: false },
  0x9a: { name: 'SWAP', isAsync: false },
  0x9b: { name: 'SWAP', isAsync: false },
  0x9c: { name: 'SWAP', isAsync: false },
  0x9d: { name: 'SWAP', isAsync: false },
  0x9e: { name: 'SWAP', isAsync: false },
  0x9f: { name: 'SWAP', isAsync: false },

  0xa0: { name: 'LOG', isAsync: false },
  0xa1: { name: 'LOG', isAsync: false },
  0xa2: { name: 'LOG', isAsync: false },
  0xa3: { name: 'LOG', isAsync: false },
  0xa4: { name: 'LOG', isAsync: false },

  // '0xf0' range - closures
  0xf0: { name: 'CREATE', isAsync: true },
  0xf1: { name: 'CALL', isAsync: true },
  0xf2: { name: 'CALLCODE', isAsync: true },
  0xf3: { name: 'RETURN', isAsync: false },

  // '0x70', range - other
  0xfe: { name: 'INVALID', isAsync: false },
  0xff: { name: 'SELFDESTRUCT', isAsync: true },
}

// Array of hard forks in order. These changes are repeatedly applied to `opcodes` until the hard fork is in the future based upon the common
// TODO: All gas price changes should be moved to common
// If the base gas cost of any of the operations change, then these should also be added to this list.
// If there are context variables changed (such as "warm slot reads") which are not the base gas fees,
// Then this does not have to be added.
const hardforkOpcodes = [
  {
    hardforkName: 'homestead',
    opcodes: {
      0xf4: { name: 'DELEGATECALL', isAsync: true }, // EIP 7
    },
  },
  {
    hardforkName: 'tangerineWhistle',
    opcodes: {
      0x54: { name: 'SLOAD', isAsync: true },
      0xf1: { name: 'CALL', isAsync: true },
      0xf2: { name: 'CALLCODE', isAsync: true },
      0x3b: { name: 'EXTCODESIZE', isAsync: true },
      0x3c: { name: 'EXTCODECOPY', isAsync: true },
      0xf4: { name: 'DELEGATECALL', isAsync: true }, // EIP 7
      0xff: { name: 'SELFDESTRUCT', isAsync: true },
      0x31: { name: 'BALANCE', isAsync: true },
    },
  },
  {
    hardforkName: 'byzantium',
    opcodes: {
      0xfd: { name: 'REVERT', isAsync: false }, // EIP 140
      0xfa: { name: 'STATICCALL', isAsync: true }, // EIP 214
      0x3d: { name: 'RETURNDATASIZE', isAsync: true }, // EIP 211
      0x3e: { name: 'RETURNDATACOPY', isAsync: true }, // EIP 211
    },
  },
  {
    hardforkName: 'constantinople',
    opcodes: {
      0x1b: { name: 'SHL', isAsync: false }, // EIP 145
      0x1c: { name: 'SHR', isAsync: false }, // EIP 145
      0x1d: { name: 'SAR', isAsync: false }, // EIP 145
      0x3f: { name: 'EXTCODEHASH', isAsync: true }, // EIP 1052
      0xf5: { name: 'CREATE2', isAsync: true }, // EIP 1014
    },
  },
  {
    hardforkName: 'istanbul',
    opcodes: {
      0x46: { name: 'CHAINID', isAsync: false }, // EIP 1344
      0x47: { name: 'SELFBALANCE', isAsync: false }, // EIP 1884
    },
  },
]

const eipOpcodes = [
  {
    eip: 2315,
    opcodes: {
      0x5c: { name: 'BEGINSUB', isAsync: false },
      0x5d: { name: 'RETURNSUB', isAsync: false },
      0x5e: { name: 'JUMPSUB', isAsync: false },
    },
  },
  {
    eip: 3198,
    opcodes: {
      0x48: { name: 'BASEFEE', isAsync: false },
    },
  },
]

/**
 * Convert basic opcode info dictonary into complete OpcodeList instance.
 *
 * @param opcodes {Object} Receive basic opcodes info dictionary.
 * @returns {OpcodeList} Complete Opcode list
 */
function createOpcodes(opcodes: {
  [key: number]: { name: string; fee: number; isAsync: boolean }
}): OpcodeList {
  const result: OpcodeList = new Map()
  for (const [key, value] of Object.entries(opcodes)) {
    const code = parseInt(key, 10)
    result.set(
      code,
      new Opcode({
        code,
        fullName: getFullname(code, value.name),
        ...value,
      })
    )
  }
  return result
}

/**
 * Get suitable opcodes for the required hardfork.
 *
 * @param common {Common} Ethereumjs Common metadata object.
 * @returns {OpcodeList} Opcodes dictionary object.
 */
export function getOpcodesForHF(common: Common): OpcodeList {
  let opcodeBuilder: any = { ...opcodes }

  for (let fork = 0; fork < hardforkOpcodes.length; fork++) {
    if (common.gteHardfork(hardforkOpcodes[fork].hardforkName)) {
      opcodeBuilder = { ...opcodeBuilder, ...hardforkOpcodes[fork].opcodes }
    }
  }
  for (const eipOps of eipOpcodes) {
    if (common.isActivatedEIP(eipOps.eip)) {
      opcodeBuilder = { ...opcodeBuilder, ...eipOps.opcodes }
    }
  }

  for (const key in opcodeBuilder) {
    const baseFee = common.param('gasPrices', opcodeBuilder[key].name.toLowerCase())
    // explicitly verify that we have defined a base fee
    if (baseFee === undefined) {
      throw new Error(`base fee not defined for: ${opcodeBuilder[key].name}`)
    }
    opcodeBuilder[key].fee = common.param('gasPrices', opcodeBuilder[key].name.toLowerCase())
  }

  return createOpcodes(opcodeBuilder)
}
