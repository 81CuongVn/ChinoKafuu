const { Command } = require('../../../structures/util')

module.exports = class RenameEmojiCommand extends Command {
  constructor() {
    super({
      name: 'renameemoji',
      aliases: ['renomearemoji'],
      permissions: [{
        entity: 'both',
        permissions: ['manageEmojisAndStickers']
      }]
    })
  }

  run(ctx) {
    const guild = ctx.message.guild
    const getEmoji = ctx.args[0].replace(/(<:)/, '').replace(/(<a:)/, '').replace(/(>)/, '').trim().split(':')
    const emoji = guild.emojis.find(emoji => emoji.id === getEmoji[1])
    if (!emoji) return ctx.replyT('error', 'basic:invalidEmoji')

    guild.editEmoji(emoji.id, { name: ctx.args.slice(1).join(' ') }).then(() => {
      ctx.replyT('success', 'commands:renameemoji.successfullyRenamed')
    })
  }
}
