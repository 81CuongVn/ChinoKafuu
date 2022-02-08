const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ShardDisconnectListener extends Listener {
  constructor() {
    super()
    this.event = 'shardDisconnect'
  }

  async on(client, error, shardID) {
    client.shardUptime.set(shardID, {
      shardID,
      uptime: NaN
    })
    if (!process.env.SHARD_CHANNEL_LOG) return
    client.getRESTChannel(process.env.SHARD_CHANNEL_LOG).then(async (channel) => {
      if (!channel) return
      const webhooks = await channel.getWebhooks()
      let webhook = webhooks.filter((w) => w.name === 'Syaro Kirima' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Syaro Kirima',
          options: {
            type: 1
          }
        })
      }

      const embed = new EmbedBuilder()
      embed.setColor('ERROR')
      embed.setTitle('Shard Disconnected')
      embed.setDescription(`Cluster: #${process.env.CLUSTER_ID ?? '0'} = Shard: ${shardID} => \`Disconnected\``)
      embed.addField('Maybe the error?', error.message)
      embed.setFooter(`Instance: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://cdn.discordapp.com/attachments/504668288798949376/874315596060311602/tumblr_ox2eeks2my1uctmvwo8_1280.png',
        username: 'Syaro Kirima'
      })
    })

    Logger.shardMessage(`Mayday! Shard ${shardID} has died!`)
  }
}
