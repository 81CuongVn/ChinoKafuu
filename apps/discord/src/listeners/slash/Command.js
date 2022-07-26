const Listener = require('../../structures/events/Listener')
const { Interaction } = require('eris')
const SlashRunner = require('../../structures/command/SlashRunner')
const { Logger } = require('../../structures/util')

module.exports = class Command extends Listener {
  constructor() {
    super()
    this.event = 'slashCommand'
    this.loadStarted = false
  }

  async on(client, interaction = new Interaction()) {
    if (interaction.type === 2) {
      try {
        if (!client.interactionPost.connected) {
          const getCommand = client.slashCommandRegistry.findByName(interaction.command.commandName)
          let callback = false
          if (getCommand !== undefined) {
            if (getCommand.removeDefaultCallback) {
              if (getCommand.callback_metadata !== undefined) {
                callback = true
                await interaction.hook.callbackHook(getCommand.callback())
              }
            }
          }
          if (!callback) {
            await interaction.hook.callbackHook({ type: 5 })
          }
        }
      } catch (err) {
        Logger.error(err)
      }
      await SlashRunner.run(client, interaction)
    }
  }
}
