// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { DBOp, DBTarget } from './operation'
import { BN, rlp } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'
import { bufBE8 } from './constants'

/*
 * This extra helper file serves as an interface between the blockchain API functionality
 * and the DB operations from `db/operation.ts` and also handles the right encoding of the keys
 */

function DBSetTD(TD: BN, blockNumber: BN, blockHash: Buffer): DBOp {
  return DBOp.set(DBTarget.TotalDifficulty, rlp.encode(TD), {
    blockNumber,
    blockHash,
  })
}

/*
 * This method accepts either a BlockHeader or a Block and returns a list of DatabaseOperation instances
 *
 * - A "Set Header Operation" is always added
 * - A "Set Body Operation" is only added if the body is not empty (it has transactions/uncles) or if the block is the genesis block
 * (if there is a header but no block saved the DB will implicitly assume the block to be empty)
 */
function DBSetBlockOrHeader(blockBody: Block | BlockHeader): DBOp[] {
  const header: BlockHeader = blockBody instanceof Block ? blockBody.header : blockBody
  const dbOps = []

  const blockNumber = header.number
  const blockHash = header.hash()

  const headerValue = header.serialize()
  dbOps.push(
    DBOp.set(DBTarget.Header, headerValue, {
      blockNumber,
      blockHash,
    })
  )

  const isGenesis = header.number.eqn(0)

  if (
    isGenesis ||
    (blockBody instanceof Block && (blockBody.transactions.length || blockBody.uncleHeaders.length))
  ) {
    const bodyValue = rlp.encode(blockBody.raw().slice(1))
    dbOps.push(
      DBOp.set(DBTarget.Body, bodyValue, {
        blockNumber,
        blockHash,
      })
    )
  }

  return dbOps
}

function DBSetHashToNumber(blockHash: Buffer, blockNumber: BN): DBOp {
  const blockNumber8Byte = bufBE8(blockNumber)
  return DBOp.set(DBTarget.HashToNumber, blockNumber8Byte, {
    blockHash,
  })
}

function DBSaveLookups(blockHash: Buffer, blockNumber: BN): DBOp[] {
  const ops = []
  ops.push(DBOp.set(DBTarget.NumberToHash, blockHash, { blockNumber }))

  const blockNumber8Bytes = bufBE8(blockNumber)
  ops.push(
    DBOp.set(DBTarget.HashToNumber, blockNumber8Bytes, {
      blockHash,
    })
  )
  return ops
}

export { DBOp, DBSetTD, DBSetBlockOrHeader, DBSetHashToNumber, DBSaveLookups }
