const mc = require('minecraft-protocol')
const EventEmitter = require('events').EventEmitter
const supportedVersions = require('./lib/version').supportedVersions
require('emit-then').register()
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV !== 'production'
) {
  require('longjohn')
}

const supportFeature = require('./lib/supportFeature')

module.exports = {
  createMCServer: createMCServer,
  Behavior: require('./lib/behavior'),
  Command: require('./lib/command'),
  generations: require('./lib/generations'),
  experience: require('./lib/experience'),
  UserError: require('./lib/user_error'),
  portal_detector: require('./lib/portal_detector'),
  supportedVersions
}

function createMCServer (options) {
  options = options || {}
  const mcServer = new MCServer()
  mcServer.connect(options)
  return mcServer
}

class MCServer extends EventEmitter {
  constructor () {
    super()
    this._server = null
  }

  connect (options) {
    const version = require('minecraft-data')(options.version).version
    if (supportedVersions.indexOf(version.majorVersion) === -1) {
      throw new Error(`Version ${version.minecraftVersion} is not supported.`)
    }
    this.supportFeature = feature => supportFeature(feature, version.majorVersion)

    const plugins = require('./lib/utils/path').allPlugins
    this._server = mc.createServer(options)
    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].server !== undefined)
      .forEach(pluginName => plugins[pluginName].server(this, options))
    if (options.logging === true) this.createLog()
    this._server.on('error', error => this.emit('error', error))
    this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port))
    this.emit('asap')
  }
}
