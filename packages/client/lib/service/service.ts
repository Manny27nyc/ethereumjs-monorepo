// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
import { Config } from '../config'
import { PeerPool } from '../net/peerpool'
import { Peer } from '../net/peer/peer'
import { Protocol } from '../net/protocol'
import { Event } from '../types'

export interface ServiceOptions {
  /* Config */
  config: Config
}

/**
 * Base class for all services
 * @memberof module:service
 */
export class Service {
  public config: Config
  public opened: boolean
  public running: boolean
  public pool: PeerPool

  /**
   * Create new service and associated peer pool
   * @param {ServiceOptions}
   */
  constructor(options: ServiceOptions) {
    this.config = options.config

    this.opened = false
    this.running = false

    this.pool = new PeerPool({
      config: this.config,
    })

    this.config.events.on(Event.PROTOCOL_MESSAGE, async (message, protocol, peer) => {
      if (this.running) {
        try {
          await this.handle(message, protocol, peer)
        } catch (error) {
          this.config.logger.debug(
            `Error handling message (${protocol}:${message.name}): ${error.message}`
          )
        }
      }
    })

    this.opened = false
    this.running = false
  }

  /**
   * Service name
   * @protected
   * @type {string}
   */
  get name(): any {
    return ''
    //throw new Error('Unimplemented')
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
   */
  get protocols(): Protocol[] {
    return []
  }

  /**
   * Open service. Must be called before service is running
   * @return {Promise}
   */
  async open() {
    if (this.opened) {
      return false
    }
    const protocols = this.protocols
    this.config.servers.map((s) => s.addProtocols(protocols))

    this.config.events.on(Event.POOL_PEER_BANNED, (peer) =>
      this.config.logger.debug(`Peer banned: ${peer}`)
    )
    this.config.events.on(Event.POOL_PEER_ADDED, (peer) =>
      this.config.logger.debug(`Peer added: ${peer}`)
    )
    this.config.events.on(Event.POOL_PEER_REMOVED, (peer) =>
      this.config.logger.debug(`Peer removed: ${peer}`)
    )
    await this.pool.open()

    this.opened = true
  }

  /**
   * Close service.
   * @return {Promise}
   */
  async close() {
    if (this.opened) {
      await this.pool.close()
    }
    this.opened = false
  }

  /**
   * Start service
   * @return {Promise}
   */
  async start(): Promise<void | boolean> {
    if (this.running) {
      return false
    }
    this.running = true
    this.config.logger.info(`Started ${this.name} service.`)
  }

  /**
   * Stop service
   * @return {Promise}
   */
  async stop(): Promise<void | boolean> {
    if (this.opened) {
      await this.close()
    }
    this.running = false
    this.config.logger.info(`Stopped ${this.name} service.`)
  }

  /**
   * Handles incoming request from connected peer
   * @param  {Object}  message message object
   * @param  {string}  protocol protocol name
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle(_message: any, _protocol: string, _peer: Peer): Promise<any> {}
}
