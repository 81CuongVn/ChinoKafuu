const Command = require("../../structures/command")
const { MessageEmbed } = require("discord.js")

module.exports = class ConfigCommand extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			aliases: ["module", "configurações", "configurar"],
			category: "util",
			UserPermission: ["MANAGE_GUILD"],
			ClientPermission: ["EMBED_LINKS"]
		})
	}

	run({ message, args, server }, t) {

		let listReport = [
			`${server.prefix}config report set <channel>`,
			`${server.prefix}config report disable`
		]

		let listPunish = [
			`${server.prefix}config punishment set <channel>`,
			`${server.prefix}config punishment disable`
		]

		let listAnimu = [
			`${server.prefix}config animu set <channel ID>`,
			`${server.prefix}config animu disable`
		]

		let modules = [
			`**${t("commands:config.config-modules.punishment.channel")}:** ${server.punishChannel ? message.guild.channels.cache.get(server.punishChannel) : t("commands:config.no-channel")}`,
			`**${t("commands:config.config-modules.punishment.module")}**: ${server.punishModule ? t("commands:config.config-modules.enable") : t("commands:config.config-modules.disable")}`,
			`**${t("commands:config.config-modules.report.channel")}:** ${server.channelReport ? message.guild.channels.cache.get(server.channelReport) : t("commands:config.no-channel")}`,
			`**${t("commands:config.config-modules.report.module")}**: ${server.reportModule ? t("commands:config.config-modules.enable") : t("commands:config.config-modules.disable")}`,
			`**${t("commands:config.config-modules.animu.module")}**: ${server.animu ? t("commands:config.config-modules.enable") : t("commands:config.config-modules.disable")}`,
			`**${t("commands:config.config-modules.animu.channel")}:** ${server.animuChannel ? message.guild.channels.cache.get(server.animuChannel) ? message.guild.channels.cache.get(server.animuChannel).name : t("commands:config.no-channel") : t("commands:config.no-channel")}`
		]

		const embed = new MessageEmbed()
			.setColor(this.client.colors.default)
			.setTitle(t("commands:config.title"))
		message.guild.icon ? embed.setThumbnail(message.guild.icon.startsWith("a_") ? message.guild.iconURL({ format: "gif" }) : message.guild.iconURL({ format: "webp" })) : null
		embed.addField(t("commands:config.how-use"), `${server.prefix}config <options> <set/disable>`)
		embed.addField(t("commands:config.report.title"), listReport.join("\n"))
		embed.addField(t("commands:config.punishment.title"), listPunish.join("\n"))
		embed.addField(t("commands:config.animu.title"), listAnimu.join("\n"))
		embed.addField(t("commands:config.modules"), modules.join("\n"))

		if (!args[0]) return message.channel.send(embed)
		if (!["report", "reportar", "punishment", "punições", "animu"].includes(args[0].toLowerCase())) return message.chinoReply("error", t("commands:config.module-not-found"))
		if (["report", "reportar"].includes(args[0].toLowerCase())) {
			if (!args[1]) return message.chinoReply("error", t("commands:config.options-not-found"))
			if (!["desativar", "false", "disable", "definir", "set", "add"].includes(args[1].toLowerCase())) return message.chinoReply("error", t("commands:config.options-not-found"))
			if (["desativar", "false", "disable"].includes(args[1].toLowerCase())) {
				server.reportModule = false
				server.channelReport = ""
				server.save()

				return message.chinoReply("success", t("commands:config.report.disable"))
			}

			if (!args[2]) return message.chinoReply("error", t("commands:config.channel-null"))
			let channel = message.guild.channels.cache.get(args[2].replace(/[<#>]/g, ""))
			if (!channel) return message.chinoReply("error", t("commands:config.channel-null"))
			if (["definir", "set", "add"].includes(args[1].toLowerCase())) {

				server.reportModule = true
				server.channelReport = channel.id
				server.save()

				return message.chinoReply("success", t("commands:config.report.enable"))
			}
		}

		if (["punishment", "punições"].includes(args[0].toLowerCase())) {
			if (!args[1]) return message.chinoReply("error", t("commands:config.options-not-found"))
			if (!["desativar", "false", "disable", "definir", "set", "add"].includes(args[1].toLowerCase())) return message.chinoReply("error", t("commands:config.options-not-found"))
			if (["desativar", "false", "disable"].includes(args[1].toLowerCase())) {
				server.punishModule = false
				server.punishChannel = ""
				server.save()

				return message.chinoReply("success", t("commands:config.punishment.disable"))
			}

			if (!args[2]) return message.chinoReply("error", t("commands:config.channel-null"))
			let channel = message.guild.channels.cache.get(args[2].replace(/[<#>]/g, ""))
			if (!channel) return message.chinoReply("error", t("commands:config.channel-null"))
			if (["definir", "set", "add"].includes(args[1].toLowerCase())) {

				server.punishModule = true
				server.punishChannel = channel.id
				server.save()

				return message.chinoReply("success", t("commands:config.punishment.enable"))
			}
		}

		if (["animu"].includes(args[0].toLowerCase())) {
			if (!args[1]) return message.chinoReply("error", t("commands:config.options-not-found"))
			if (!["desativar", "false", "disable", "definir", "set", "add"].includes(args[1].toLowerCase())) return message.chinoReply("error", t("commands:config.options-not-found"))
			if (["desativar", "false", "disable"].includes(args[1].toLowerCase())) {
				server.animu = false
				server.animuChannel = ""
				server.save()

				return message.chinoReply("success", t("commands:config.animu.disable"))
			}

			if (!args[2]) return message.chinoReply("error", t("commands:config.channel-null"))
			let channel = message.guild.channels.cache.get(args[2].replace(/[<#>]/g, ""))
			if (!channel) return message.chinoReply("error", t("commands:config.channel-null"))
			if (["definir", "set", "add"].includes(args[1].toLowerCase())) {
				server.animu = true
				server.animuChannel = channel.id
				server.save()

				return message.chinoReply("success", t("commands:config.animu.enable"))
			}
		}

		if (["antiflood"].includes(args[0].toLowerCase())) {
			if (!args[1]) return message.chinoReply("error", t("commands:config.antiflood.options-not-found"))
			if (!["enable", "ativar", "disable", "desativar", "messageslimit"].includes(args[1].toLowerCase())) return message.chinoReply("error", t("commands:config.antiflood.options-not-found"))
			if (["enable", "ativar", "disable", "desativar"].includes(args[1].toLowerCase())) {
				let enable = ["enable", "ativar"].includes(args[1].toLowerCase()) ? true : (["disable", "desativar"].includes(args[1].toLowerCase())) ? false : null;
				if (enable === null) return message.chinoReply("error", t("commands:config.antiflood.options-not-found"))
				if (server.antiflood.enabled === enable) {
					let msg = enable ? "already-enabled" : "already-disabled"
					return message.chinoReply("error", t(`commands:config.antiflood.${msg}`))
				}
				server.antiflood.enabled = enable;
				server.markModified('antiflood.enabled')
				server.save()
				message.chinoReply("success", `${t(`commands:config.antiflood.${enable ? "enable" : "disabled"}`)}`)
			}
			if (["messageslimit"].includes(args[1].toLowerCase())) {
				let nbm = Number(args[2])
				if (isNaN(nbm)) return message.chinoReply("error", t("commands:config.invalid-number"))
				if (nbm <= 2) return message.chinoReply("error", t("commands:config.more-of-2"))

				server.antiflood.messagesLimit = Number(nbm);
				server.markModified('antiflood.messagesLimit')
				server.save()
				message.chinoReply("success", t("commands:config.antiflood.messageslimit-changed", {
					nbm
				}))
			}
		}
	}
}
