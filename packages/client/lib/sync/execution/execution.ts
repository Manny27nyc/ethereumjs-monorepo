// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { Config } from '../../config'
import { Chain } from '../../blockchain'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'

export interface ExecutionOptions {
  /* Config */
  config: Config

  /* State database */
  stateDB?: LevelUp

  /** Chain */
  chain: Chain
}

export abstract class Execution {
  public config: Config

  protected stateDB?: LevelUp
  protected chain: Chain

  public running: boolean = false

  /**
   * Create new excution module
   * @memberof module:sync/execution
   */
  constructor(options: ExecutionOptions) {
    this.config = options.config
    this.chain = options.chain
    this.stateDB = options.stateDB
  }

  /**
   * Runs an execution
   *
   * @returns number quantifying execution run
   */
  abstract run(): Promise<number>

  /**
   * Stop execution. Returns a promise that resolves once stopped.
   */
  async stop(): Promise<boolean> {
    this.running = false
    this.config.logger.info('Stopped execution.')
    return true
  }
}
