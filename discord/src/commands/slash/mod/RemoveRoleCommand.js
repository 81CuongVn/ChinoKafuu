const { Command } = require('../../../structures/util')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class RemoveRoleCommand extends Command {
  constructor() {
    super({
      name: 'removerole',
      arguments: 2,
      aliases: ['removercargo'],
      hasUsage: true,
      permissions: [{
        entity: 'both',
        permissions: ['manageRoles']
      }],
      slash: new CommandBase()
        .setName('removerole')
        .setDescription('Removes a role from a guild member.')
        .addOptions(
          new CommandOptions()
            .setName('member')
            .setDescription('The guild member who you want remove the role.')
            .setType(6)
            .isRequired(),
          new CommandOptions()
            .setName('role')
            .setDescription('The role of the guild member that actually have.')
            .setType(8)
            .isRequired()
        )
    })
  }

  async run(ctx) {
    const member = await ctx.getMember(ctx.args.get('member').value?.id ?? ctx.args.get('member').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const role = await ctx.getRole(ctx.args.get('role').value)
    if (!role) return ctx.replyT('error', 'basic:invalidRole')
    if (!member.roles.includes(role.id)) return ctx.replyT('error', 'commands:removerole.alreadyRemoved')
    member.removeRole(role.id).then(() => {
      ctx.replyT('success', 'commands:removerole.success')
    }).catch(() => ctx.replyT('error', 'commands:addrole.higher'))
  }
}
