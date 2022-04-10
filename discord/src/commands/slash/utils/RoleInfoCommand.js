const { Command, EmbedBuilder } = require('../../../structures/util')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class RoleInfoCommand extends Command {
  constructor() {
    super({
      name: 'roleinfo',
      aliases: ['cargoinfo'],
      permissions: [],
      slash: new CommandBase()
        .setName('roleinfo')
        .setDescription('Shows some informations about a role.')
        .addOptions(
          new CommandOptions()
            .setType(8)
            .setName('role')
            .setDescription('Mention the role for more information.')
            .isRequired(),
        )
    })
  }

  run(ctx) {
    const role = ctx.message.guild.roles.get(ctx.args.get('role').value)
    if (!role) return ctx.replyT('error', 'commands:roleinfo.roleNotExist')

    const embed = new EmbedBuilder()
    embed.setColor(`#${role.color.toString(16)}`)
    embed.setTitle(ctx._locale('commands:roleinfo.roleName', { 0: role.name }))
    embed.addField(ctx._locale('commands:roleinfo.roleMention'), role.mention, true)
    embed.addField(ctx._locale('commands:roleinfo.roleID'), role.id, true)
    embed.addField(ctx._locale('commands:roleinfo.roleColor'), `#${role.color.toString(16).toUpperCase()}`, true)
    embed.addField(ctx._locale('commands:roleinfo.roleGuild'), `\`${role.guild.name}\``, true)
    embed.addField(ctx._locale('commands:roleinfo.roleHoist'), ctx._locale(`basic:boolean.${role.hoist}`), true)
    embed.addField(ctx._locale('commands:roleinfo.roleMentionable'), ctx._locale(`basic:boolean.${role.mentionable}`), true)
    embed.addField(ctx._locale('commands:roleinfo.roleManaged'), ctx._locale(`basic:boolean.${role.managed}`), true)
    embed.addField(ctx._locale('commands:roleinfo.roleCreatedAt'), parseInt(role.createdAt / 1000).toFixed(0), true)

    ctx.send(embed.build())
  }
}
