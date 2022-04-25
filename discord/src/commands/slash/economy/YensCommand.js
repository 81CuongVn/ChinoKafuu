const { Command } = require('../../../structures/util')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class YensCommand extends Command {
  constructor() {
    super({
      name: 'yens',
      aliases: ['yen'],
      slash: new CommandBase()
        .setName('yens')
        .setDescription('Shows you current balance or someone else\'s balance.')
        .addOptions(new CommandOptions()
          .setType(6)
          .setName('user')
          .setDescription('Mention of the member.')
        )
    })
  }

  async run(ctx) {
    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user)
    if (!member) {
      const sugarcube = Number(ctx.db.user?.sugarcube ?? 0).toLocaleString()
      const yens = Number(ctx.db.user.yens).toLocaleString()
      await ctx.replyT('yen', 'commands:yens.yens', { yens: `\`${yens}\``, sugarcube: `\`${sugarcube}\`` })
      return
    }

    const userData = await ctx.db.db.getOrCreate(member.id)
    const yens = Number(userData.yens).toLocaleString()
    const sugarcube = Number(userData?.sugarcube ?? 0).toLocaleString()
    return ctx.replyT('yen', 'commands:yens.onMention', { user: member.mention, yens: `\`${yens}\``, sugarcube: `\`${sugarcube}\`` })
  }
}
