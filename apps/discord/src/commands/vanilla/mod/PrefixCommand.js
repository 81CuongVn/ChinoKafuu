const { Command } = require('../../../structures/util')

module.exports = class PrefixCommand extends Command {
  constructor() {
    super({
      name: 'prefix',
      permissions: [{
        entity: 'user',
        permissions: ['manageGuild']
      }]
    })
  }

  async run(ctx) {
    if (ctx.args[0].length > 3) return ctx.replyT('error', 'commands:prefix.length')
    const prefix = ctx.args[0]
    ctx.db.guild.prefix = prefix
    ctx.db.guild.save()
    await ctx.replyT('success', 'commands:prefix.success', { prefix: prefix })
  }
}
