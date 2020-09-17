const Command = require("../../structures/command")
const { MessageEmbed } = require("discord.js")
module.exports = class AnnounceCommand extends Command {
	constructor(client) {
		super(client, {
			name: "announce",
			category: "mod",
			aliases: ["anunciar"],
			UserPermission: ["MANAGE_GUILD", "MENTION_EVERYONE"],
			ClientPermission: ["MENTION_EVERYONE", "EMBED_LINKS", "ADD_REACTIONS"],
			OnlyDevs: false
		})
	}
	run({ message, args, server }, t) {

		let chat = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
		if (!chat) return message.chinoReply("error", t("commands:announce.noMention"))
		let announce = args.slice(1).join(" ")
		if (!announce) return message.chinoReply("error", t("commands:announce.noMsg"))
		let avatar = message.author.displayAvatarURL({ format: "png", dynamic: true })
		const embed = new MessageEmbed()
			.setColor(this.client.colors.default)
			.setAuthor(message.guild.name, message.guild.icon ? message.guild.iconURL({ format: "png", dynamic: true }) : null)
			.setDescription(announce)
			.setFooter(`${t("commands:announce.by")}: ${message.author.username}`, avatar)

		message.reply(t("commands:announce.confirmed", { chat: chat.toString() })).then(msg => {
			setTimeout(() => {
				msg.react("success:577973168342302771")
			}, 500)
			setTimeout(() => {
				msg.react("warn:672470606578581524")
			}, 1000)
			setTimeout(() => {
				msg.react("error:577973245391667200")
			}, 1500)
			const collector = msg.createReactionCollector((r, u) => (r.emoji.name === "success", "warn", "error") && (u.id !== this.client.user.id && u.id === message.author.id))
			collector.on("collect", r => {
				switch (r.emoji.name) {
					case "success":
						chat.send("@everyone", { disableMentions: false, embed: embed })
						msg.delete()
						message.chinoReply("success", t("commands:announce.send"))
						break
					case "warn":
						chat.send("@here", { disableMentions: false, embed: embed })
						msg.delete()
						message.chinoReply("success", t("commands:announce.send"))
						break
					case "error":
						chat.send(embed)
						msg.delete()
						message.chinoReply("success", t("commands:announce.send"))
				}
			})
		})
	}
}
