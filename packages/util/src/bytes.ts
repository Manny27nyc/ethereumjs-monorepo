// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import BN from 'bn.js'
import { intToBuffer, stripHexPrefix, padToEven, isHexString, isHexPrefixed } from 'ethjs-util'
import { PrefixedHexString, TransformableToArray, TransformableToBuffer } from './types'
import { assertIsBuffer, assertIsArray, assertIsHexString } from './helpers'

/**
 * Returns a buffer filled with 0s.
 * @param bytes the number of bytes the buffer should be
 */
export const zeros = function (bytes: number): Buffer {
  return Buffer.allocUnsafe(bytes).fill(0)
}

/**
 * Pads a `Buffer` with zeros till it has `length` bytes.
 * Truncates the beginning or end of input if its length exceeds `length`.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @param right whether to start padding form the left or right
 * @return (Buffer)
 */
const setLength = function (msg: Buffer, length: number, right: boolean) {
  const buf = zeros(length)
  if (right) {
    if (msg.length < length) {
      msg.copy(buf)
      return buf
    }
    return msg.slice(0, length)
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length)
      return buf
    }
    return msg.slice(-length)
  }
}

/**
 * Left Pads a `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthLeft = function (msg: Buffer, length: number) {
  assertIsBuffer(msg)
  return setLength(msg, length, false)
}

/**
 * Right Pads a `Buffer` with trailing zeros till it has `length` bytes.
 * it truncates the end if it exceeds.
 * @param msg the value to pad (Buffer)
 * @param length the number of bytes the output should be
 * @return (Buffer)
 */
export const setLengthRight = function (msg: Buffer, length: number) {
  assertIsBuffer(msg)
  return setLength(msg, length, true)
}

/**
 * Trims leading zeros from a `Buffer`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
const stripZeros = function (a: any): Buffer | number[] | string {
  let first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1)
    first = a[0]
  }
  return a
}

/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export const unpadBuffer = function (a: Buffer): Buffer {
  assertIsBuffer(a)
  return stripZeros(a) as Buffer
}

/**
 * Trims leading zeros from an `Array` (of numbers).
 * @param a (number[])
 * @return (number[])
 */
export const unpadArray = function (a: number[]): number[] {
  assertIsArray(a)
  return stripZeros(a) as number[]
}

/**
 * Trims leading zeros from a hex-prefixed `String`.
 * @param a (String)
 * @return (String)
 */
export const unpadHexString = function (a: string): string {
  assertIsHexString(a)
  a = stripHexPrefix(a)
  return stripZeros(a) as string
}

export type ToBufferInputTypes =
  | PrefixedHexString
  | number
  | BN
  | Buffer
  | Uint8Array
  | number[]
  | TransformableToArray
  | TransformableToBuffer
  | null
  | undefined

/**
 * Attempts to turn a value into a `Buffer`.
 * Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BN` and other objects
 * with a `toArray()` or `toBuffer()` method.
 * @param v the value
 */
export const toBuffer = function (v: ToBufferInputTypes): Buffer {
  if (v === null || v === undefined) {
    return Buffer.allocUnsafe(0)
  }

  if (Buffer.isBuffer(v)) {
    return Buffer.from(v)
  }

  if (Array.isArray(v) || v instanceof Uint8Array) {
    return Buffer.from(v as Uint8Array)
  }

  if (typeof v === 'string') {
    if (!isHexString(v)) {
      throw new Error(
        `Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`
      )
    }
    return Buffer.from(padToEven(stripHexPrefix(v)), 'hex')
  }

  if (typeof v === 'number') {
    return intToBuffer(v)
  }

  if (BN.isBN(v)) {
    return v.toArrayLike(Buffer)
  }

  if (v.toArray) {
    // converts a BN to a Buffer
    return Buffer.from(v.toArray())
  }

  if (v.toBuffer) {
    return Buffer.from(v.toBuffer())
  }

  throw new Error('invalid type')
}

/**
 * Converts a `Buffer` to a `Number`.
 * @param buf `Buffer` object to convert
 * @throws If the input number exceeds 53 bits.
 */
export const bufferToInt = function (buf: Buffer): number {
  return new BN(toBuffer(buf)).toNumber()
}

/**
 * Converts a `Buffer` into a `0x`-prefixed hex `String`.
 * @param buf `Buffer` object to convert
 */
export const bufferToHex = function (buf: Buffer): string {
  buf = toBuffer(buf)
  return '0x' + buf.toString('hex')
}

/**
 * Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.
 * @param num Signed integer value
 */
export const fromSigned = function (num: Buffer): BN {
  return new BN(num).fromTwos(256)
}

/**
 * Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
 * @param num
 */
export const toUnsigned = function (num: BN): Buffer {
  return Buffer.from(num.toTwos(256).toArray())
}

/**
 * Adds "0x" to a given `String` if it does not already start with "0x".
 */
export const addHexPrefix = function (str: string): string {
  if (typeof str !== 'string') {
    return str
  }

  return isHexPrefixed(str) ? str : '0x' + str
}

/**
 * Converts a `Buffer` or `Array` to JSON.
 * @param ba (Buffer|Array)
 * @return (Array|String|null)
 */
export const baToJSON = function (ba: any): any {
  if (Buffer.isBuffer(ba)) {
    return `0x${ba.toString('hex')}`
  } else if (ba instanceof Array) {
    const array = []
    for (let i = 0; i < ba.length; i++) {
      array.push(baToJSON(ba[i]))
    }
    return array
  }
}
