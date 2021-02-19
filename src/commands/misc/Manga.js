const { Command, EmbedBuilder } = require('../../utils')
const Anilist = require('anilist-node')
const anilist = new Anilist()
const Logger = require('../../structures/util/Logger')

module.exports = class MangaCommand extends Command {
    constructor() {
        super({
            name: 'manga',
            aliases: [],
            hasUsage: true,
            permissions: [{
                entity: 'bot',
                permissions: ['embedLinks']
            }]
        })
    }

    async run(ctx) {
        const search = ctx.args.join(' ')
        const t = ctx._locale
        if (!search) return ctx.replyT('error', 'commands:manga.invalidManga')

        try {
            const manga = await anilist.search('manga', search)
            if (!manga.media[0]) return ctx.replyT('error', 'commands:manga.mangaNotFound', { 0: search })
            const result = await anilist.media.manga(manga.media[0].id)

            const startDate = {
                year: result.startDate.year ?? '----',
                month: result.startDate.month ?? '--',
                day: result.startDate.day ?? '--'
            }

            const finishDate = {
                year: result.endDate.year ?? '----',
                month: result.endDate.month ?? '--',
                day: result.endDate.day ?? '--'
            }

            const characters = []
            if (result.characters) {
                for (const c of result.characters) {
                    characters.push(`${c.name}`)
                }
            }

            if (!characters[0]) characters.push('----')
            const type = result.format.charAt(0).toUpperCase() + result.format.slice(1).toLowerCase()
            const status = result.status.charAt(0).toUpperCase() + result.status.slice(1).toLowerCase()

            const embed = new EmbedBuilder()
            embed.setColor('DEFAULT')
            embed.setUrl(result.siteUrl)
            embed.setTitle(result.title.userPreferred)
            embed.setThumbnail(result.coverImage.large)
            embed.setDescription(result.description?.replace(/(<\/b>|<b>|<br>|<Br>|<bR>|<BR>)/g, '\u200B'))
            embed.addField(t('commands:manga.type'), type, true)
            embed.addField(t('commands:manga.status'), status, true)
            embed.addField(t('commands:manga.vols'), result.volumes ?? '--', true)
            embed.addField(t('commands:manga.chapters'), result.chapters ?? '--', true)
            embed.addField(t('commands:manga.score'), result.meanScore, true)
            embed.addField(t('commands:manga.aired'), `${startDate.month}/${startDate.day}/${startDate.year} | ${finishDate.month}/${finishDate.day}/${finishDate.year}`, true)
            embed.addField(t('commands:manga.genres'), result.genres.join(', '), true)
            embed.addField(t('commands:manga.characters'), characters.join(', ').slice(0, 1020), true)
            embed.setFooter(`©️ ${ctx.client.user.username}`)
            embed.setTimestamp()

            ctx.send(embed.build())
        } catch (err) {
            Logger.error(err)
            ctx.replyT('error', 'commands:manga.mangaNotFound', { 0: search })
        }
    }
}
