// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
const pino = require('pino')

export function getLogger(options = { loglevel: 'info' }) {
  return pino({
    level: options.loglevel,
    base: null,
  })
}

export const defaultLogger = getLogger({ loglevel: 'debug' })
