const EmbedBuilder = require('../../structures/util/EmbedBuilder')

module.exports = class Helper {
	constructor(context, commandName, commandAliases, commandUsage, commandDescription, perms) {
		this.context = context
		this.name = commandName
		this.aliases = commandAliases
		this.usage = commandUsage
		this.description = commandDescription
		this.perms = perms
	}

	help() {
		const usage = this.usage.split(' ')
		const commandName = `${this.context.db.guild.prefix}${this.name}`
		const commandWithUsage = `\`${commandName}\` ${usage.map(element => `\`${element}\``).join(' ')}`
		const embedDescription = `\n\n**${this.context._locale('basic:howToUse')}** ${commandWithUsage}`
		const aliases = this.aliases.join(', ') || this.context._locale('basic:noAliases')
		const fixedPermissionList = this.perms.flatMap(object => object.entity === 'both' ? [{
			entity: 'user',
			permissions: object.permissions
		},
		{
			entity: 'bot',
			permissions: object.permissions
		}] : object)
		const userPerms = fixedPermissionList.filter(({ entity }) => entity === 'user').map(({ permissions }) => this.context._locale('basic:permissions.permissionUserRequired', { 0: permissions.map(perms => `\`${this.context._locale(`permission:${perms}`)}\``).join(', ') }))[0]
		const clientPerms = fixedPermissionList.filter(({ entity }) => entity === 'bot').map(({ permissions }) => this.context._locale('basic:permissions.permissionBotRequired', { 0: permissions.map(perms => `\`${this.context._locale(`permission:${perms}`)}\``).join(', ') }))[0]
		let perms = []
		if (!perms[0]) {
			if (typeof userPerms === 'string') {
				perms.push(userPerms)
			}

			if (typeof clientPerms === 'string') {
				perms.push(clientPerms)
			}
		}

		const embed = new EmbedBuilder()
		embed.setTitle(`\`${this.context.db.guild.prefix}${this.name}\``)
		embed.setColor('DEFAULT')
		embed.setDescription(`${this.description}${embedDescription}`)
		embed.setFooter(`©️ ${this.context.client.user.username}`)
		embed.setTimestamp()
		if (perms[0]) {
			let perm
			if (perms[0] && !perms[1]) {
				perm = perms[0]
			} else if (perms[1]) {
				perm = `${perms[0]}\n${perms[1]}`
			}

			embed.addField(this.context._locale('basic:permissions.title'), perm)
		}
		embed.addField(this.context._locale('basic:aliases'), aliases)

		return this.context.send(embed.build(this.context.message.author.mention))
	}
}
