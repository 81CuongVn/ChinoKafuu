const Listener = require('../../structures/events/Listener')
const { TopGGUtils, Logger } = require('../../structures/util')
module.exports = class ReadyConnectionListener extends Listener {
  constructor() {
    super()
    this.send = false
    this.event = 'readyConnection'
  }

  async on(client) {
    if (process.env.INTERACTION_URL.startsWith('ws://') || process.env.INTERACTION_URL.startsWith('wss://')) {
      client.interactionPost.client = client
      client.interactionPost.connect()
    }

    client.startShard = Date.now()
    // client.cacheManager.start()
    const top_gg = new TopGGUtils()
    await top_gg.post(client)
    // const lavalink = new LavalinkManager(client)

    if (client.lavalink !== undefined) {
      client.lavalink.emit('setManager', (client))
    }

    const game = [
      { name: 'Petit Rabbit\'s - Tokimeki Poporon', type: 2 },
      { name: 'Petit Rabbit\'s - Daydream café', type: 2 },
      { name: 'Petit Rabbit\'s - Tenkuu Cafeteria' },
      { name: 'Petit Rabbit\'s - No Poi', type: 2 },
      { name: 'Gochuumon wa Usagi Desu Ka?', type: 3 },
      { name: 'Gochuumon wa Usagi Desu ka??: Sing for You', type: 3 },
      { name: 'Gochuumon wa Usagi Desu Ka? BLOOM', type: 3 },
      { name: 'Okaeri to Rabbit House Coffee.', type: 1, url: 'https://twitch.tv/danielagc' },
      { name: '🐦 Follow me in twitter: @ChinoKafuuBot', type: 1, url: 'https://twitch.tv/danielagc' },
      { name: 'If you need support, use /help', type: 1, url: 'https://twitch.tv/danielagc' },
      { name: 'Drink a tea on Fleur de Lapin', type: 1, url: 'https://twitch.tv/danielagc' },
      { name: 'Lapin The Phantom Thief', type: 3 },
      { name: 'Miracle Girls Festival', type: 0 },
      { name: 'Chimame Chronicle', type: 0 }
    ]
    if (!this.send) {
      /**
       * @description This will serve to enable first hit features
       */
      this.send = true
      const update = () => {
        setTimeout(() => {
          const status = game[Math.round(Math.random() * game.length)]
          if (status?.type === 0) {
            client.editStatus('idle', status)
          } else {
            client.editStatus('online', status)
          }
        }, 7 * 1000)
      }
      update()
    }

    setInterval(() => {
      const status = game[Math.round(Math.random() * game.length)]
      if (status?.type === 0) {
        client.editStatus('idle', status)
      } else {
        client.editStatus('online', status)
      }
    }, 20 * 1000) // Add 20 seconds to avoid over-updating.
    if (process.env.CLUSTERS === 'true') {
      Logger.info(`Shards from ${client.clusters.firstShardID} - ${Number(client.clusters.firstShardID) + Number(process.env.SHARDS_PER_CLUSTER)} are online.`)
    } else {
      Logger.info('All shards are connected!')
    }
  }
}
