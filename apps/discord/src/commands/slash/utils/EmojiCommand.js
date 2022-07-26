const { Command } = require('../../../structures/util')
const axios = require('axios')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class EmojiCommand extends Command {
  constructor() {
    super({
      name: 'emoji',
      aliases: [],
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('emoji')
        .setDescription('Get the emoji attachment.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('emoji')
            .setDescription('Mention an emoji')
            .isRequired()
        )
    })
  }

  async run(ctx) {
    const emoji = await ctx.getEmoji(ctx.args.get('emoji')?.value)
    if (!emoji) return ctx.replyT('error', 'basic:invalidEmoji')

    const buffer = await axios.get(emoji.url, { responseType: 'arraybuffer' }).then(d => d.data)
    ctx.send('', {
      file:
      {
        file: buffer,
        name: `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`
      }
    })
  }
}
