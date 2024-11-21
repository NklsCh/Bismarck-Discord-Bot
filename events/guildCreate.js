const {
    Events,
} = require( 'discord.js' )
const Guild = require( '../models/guilds' )
const cMessage = require( '../models/cMessage' )

module.exports = {
    name: Events.GuildCreate,
    async execute( guild ) {
        let client = guild.client
        await Guild.create( {
            guildId: guild.id,
        } )
        await cMessage.create( {
            guildId: guild.id,
        } )
    },
}
