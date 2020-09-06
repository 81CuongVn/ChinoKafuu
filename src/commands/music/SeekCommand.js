const Command = require("../../structures/command")
const parse = require("parse-duration")
const { MessageEmbed } = require("discord.js")
module.exports = class SeekCommand extends Command {
	constructor(client) {
		super(client, {
			name: "seek",
			category: "music",
			aliases: ["posicao"],
			UserPermission: null,
			ClientPermission: null,
			OnlyDevs: false
		})
	}
	run({ message, args, server }, t) {

		const embed = new MessageEmbed()
			.setDescription(t("commands:play.unavailable"))
			.setColor(this.client.colors.default)
		message.channel.send(embed)

		// if (!this.client.player.has(message.guild.id)) return message.chinoReply("error", t("commands:dj-module.queue-null"))
		// if (!args[0]) return message.chinoReply("error", t("commands:seek.args-null"))

		// message.chinoReply("success", t("commands:seek.success"))
		// this.client.player.get(message.guild.id).player.seek(parse(`${args[0]}s`))
	}
}