const { Command, Button, Emoji } = require('../../../structures/util')
const { CommandBase } = require('eris')
const NightlyInteraction = require('../../../structures/nightly/NightlyInteraction')

module.exports = class DivorceCommand extends Command {
  constructor() {
    super({
      name: 'divorce',
      aliases: ['divorciar'],
      arguments: 0,
      permissions: [{
        entity: 'bot',
        permissions: ['addReactions']
      }],
      slash: new CommandBase()
        .setName('divorce')
        .setDescription('Divorces you to your current partner (I will charge 300 yens to divorce).')
    })
  }

  async run(ctx) {
    const author = ctx.db.user
    if (!author.isMarry) return ctx.replyT('error', 'commands:divorce.youAreNotMarried', { 0: ctx.db.guild.prefix })
    const couple = await ctx.client.database.users.getOrCreate(author.marryWith)
    if (author.yens < Number(300)) return ctx.replyT('error', 'commands:divorce.youNeedToDivorce', { 0: Number(300 - author.yens).toLocaleString() })
    if (couple.yens < Number(300)) return ctx.replyT('error', 'commands:divorce.theyNeedToDivorce', { 0: Number(300 - couple.yens).toLocaleString() })
    ctx.interaction()
      .components(new Button()
        .setLabel(ctx._locale('basic:boolean.true'))
        .customID('confirm_button')
        .setStyle(3),
      new Button()
        .setLabel(ctx._locale('basic:boolean.false'))
        .customID('reject_button')
        .setStyle(4))
      .returnCtx()
      .replyT('warn', 'commands:divorce.requestConfirm')
      .then(message => {
        const ack = new NightlyInteraction(message)
        ack.on('collect', ({ packet }) => {
          if ((packet.d.member.user.id === author.id && message.author.id === ctx.client.user.id)) {
            return ack.sendAck('respond', {
              content: `You need to wait for the person to sign the paperwork to run this command.`,
              flags: 1 << 6
            })
          }
          switch (packet.d.data.custom_id) {
            case 'confirm_button': {
              author.yens -= Number(300)
              author.isMarry = false
              author.marryWith = ''
              couple.yens -= Number(300)
              couple.isMarry = false
              couple.marryWith = ''
              author.save()
              couple.save().then(() => {
                ack.sendAck('update', {
                  content: `${Emoji.getEmoji('broken_heart').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:divorce.successfullyDivorced')}`,
                  components: [
                    {
                      type: 1,
                      components: [
                        new Button()
                          .setLabel(ctx._locale('basic:boolean.true'))
                          .customID('confirm_button')
                          .setStyle(3)
                          .setStatus(true)
                          .data(),
                        new Button()
                          .setLabel(ctx._locale('basic:boolean.false'))
                          .customID('reject_button')
                          .setStyle(4)
                          .setStatus(true)
                          .data()
                      ]
                    }
                  ]
                })
              })
            }
              break
            case 'reject_button': {
              ack.sendAck('update', {
                content: `${Emoji.getEmoji('heart').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:divorce.rejectedRequest')}`,
                components: [
                  {
                    type: 1,
                    components: [
                      new Button()
                        .setLabel(ctx._locale('basic:boolean.true'))
                        .customID('confirm_button')
                        .setStyle(3)
                        .setStatus(true)
                        .data(),
                      new Button()
                        .setLabel(ctx._locale('basic:boolean.false'))
                        .customID('reject_button')
                        .setStyle(4)
                        .setStatus(true)
                        .data()
                    ]
                  }
                ]
              })
            }
              break
          }
        })
      })
  }
}
