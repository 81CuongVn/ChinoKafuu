const { Command, EmbedBuilder } = require('../../../utils')
const moment = require('moment')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class UserInfoCommand extends Command {
  constructor() {
    super({
      name: 'userinfo',
      aliases: [],
      hasUsage: true,
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('userinfo')
        .setDescription('Shows some information about a user.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention a user.')
        )
    })
  }

  async run(ctx) {
    moment.locale(ctx.db.guild.lang)
    const user = ctx.message.command.interface.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user, true)
    let hoist
    const avatar = ctx.message.guild.members.get(member.id)?.guildAvatar ?? member.avatarURL
    const guild = ctx.message.guild
    if (guild.members.get(member.id)) {
      const role = guild.members.get(member.id).roles
        .map((a) => ctx.message.guild.roles.get(a))
        .filter((z) => z && z.color >= 0)
        .sort((a, b) => b.position - a.position)
      hoist = role[0]
    }

    const highRole = guild.roles.get(hoist?.id)
    const embed = new EmbedBuilder()
    embed.setColor(`#${highRole?.color.toString(16)}` ?? null)
    embed.setThumbnail(avatar)
    embed.addField(ctx._locale('commands:userinfo.username'), `${member.username}#${member.discriminator}`, true)
    embed.addField(ctx._locale('commands:userinfo.userid'), member.id, true)
    embed.addField(ctx._locale('commands:userinfo.createdAt'), moment(member.createdAt).format('LLLL'), true)
    guild.members.get(member.id) ? embed.addField(ctx._locale('commands:userinfo.joinedAt'), moment(guild.members.get(member.id).joinedAt).format('LLLL'), true) : null
    guild.members.get(member.id) ? embed.addField(ctx._locale('commands:userinfo.highRole'), highRole?.mention, true) : null
    guild.members.get(member.id)?.premiumSince ? embed.addField(ctx._locale('commands:userinfo.boostSince'), moment(guild.members.get(member.id).premiumSince).format('LLLL'), true) : null
    guild.members.get(member.id) ? embed.addField(ctx._locale('commands:userinfo.hasPermissions'), this.checkPermission(ctx._locale, guild, member).join(', ')) : null

    ctx.send(embed.build())
  }

  checkPermission(_locale, guild, member) {
    const allowedPerms = []
    const perms = [
      'createInstantInvite',
      'kickMembers',
      'banMembers',
      'administrator',
      'manageChannels',
      'manageGuild',
      'addReactions',
      'viewAuditLog',
      'voicePrioritySpeaker',
      'voiceStream',
      'viewChannel',
      'sendMessages',
      'sendTTSMessages',
      'manageMessages',
      'embedLinks',
      'attachFiles',
      'readMessageHistory',
      'mentionEveryone',
      'useExternalEmojis',
      'viewGuildInsights',
      'voiceConnect',
      'voiceSpeak',
      'voiceMuteMembers',
      'voiceDeafenMembers',
      'voiceMoveMembers',
      'voiceUseVAD',
      'changeNickname',
      'manageNicknames',
      'manageRoles',
      'manageWebhooks',
      'manageEmojis',
      'useSlashCommands',
      'manageThreads',
      'usePrivateThreads',
      'useExternalStickers',
      'usePublicThreads'
    ]

    perms.forEach(perms => {
      if (guild.members.get(member.id).permissions.json[perms]) {
        allowedPerms.push(`\`${_locale(`permission:${perms}`)}\``)
      }
    })

    return allowedPerms
  }
}
