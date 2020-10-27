const Listener = require('../structures/events/Listener')
const EmbedBuilder = require('../structures/util/EmbedBuilder')

module.exports = class GuildCreateListener extends Listener {
    constructor() {
        super()
        this.event = 'guildCreate'
        this.region = {
            'brazil': 'pt-BR',
            'eu-central': 'en-US',
            'eu-west': 'en-US',
            'hongkong': 'en-US',
            'japan': 'en-US',
            'russia': 'en-US',
            'singapore': 'en-US',
            'southafrica': 'en-US',
            'sydney': 'en-US',
            'us-central': 'es-ES',
            'us-east': 'en-US',
            'us-south': 'es-ES',
            'us-west': 'en-US',
        }
    }

    async on(client, guild) {
        let server = await client.database.guilds.getOrCreate(guild.id, {
            lang: this.region[guild.region]
        })

        let t = client.i18nRegistry.getT(server.lang)
        let me = guild.members.get(client.user.id).permission.has('viewAuditLogs')
        if (!me) return
        let audit = await guild.getAuditLogs()
        let guildAudit = audit.entries.filter(action => action.actionType === 28)
        let user = await client.users.get(guildAudit[0].user.id)
        const embed = new EmbedBuilder()
        embed.setImage('https://cdn.discordapp.com/attachments/648188298149232644/770759671552016414/gc9DEF.png')
        embed.setColor('DEFAULT')
        embed.setFooter(t('basic:addedToGuild.guildSaved', { 0: guild.name }), guild.icon ? guild.iconURL : null)
        embed.addField(t('basic:addedToGuild.thanks'), t('basic:addedToGuild.description', { 0: user.mention, 1: guild.name, 2: server.prefix }))

        user.getDMChannel().then(channel => channel.createMessage({ embed: embed }))
    }
}
