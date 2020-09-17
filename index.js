require('./src/structures/ProtoTypes').start()

const Client = require('./src/ChinoClient')
const ShardManager = require('./src/structures/ShardManager')
const config = require('./config')
const client = new Client({
	disableMentions: "everyone"
})

if (client.shard) client.shardManager = new ShardManager(client)

client.loadLocales()
client.loadCommands('./src/commands')
client.loadEvents('./src/events')
client.login(config.token)
	.then(() => console.log(`${client.shard ? ('Shard ' + client.shard.ids) : 'Bot'} is online.`))
	.catch((e) => console.log(`Failure connecting to Discord! ${e.message}!`))
