const {
    Events,
    ActivityType: { Watching },
    Events,
} = require( 'discord.js' )
const Guild = require( '../models/guilds' )
const cMessage = require( '../models/cMessage' )

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute( client ) {
        let serverAmount = await client.guilds.fetch( { cache: true } )
        await Guild.sync()
        await cMessage.sync()


        await client.guilds.fetch( { cache: true } )

        client.guilds.cache.forEach( async ( guild ) => {
            await Guild.findOrCreate( {
                where: {
                    guildId: guild.id,
                },
            } )

            await cMessage.findOrCreate( {
                where: {
                    guildId: guild.id,
                },
            } )
        } )

        client.user.setPresence( {
            activities: [
                {
                    name: `${ serverAmount.size } server(s)`,
                    type: Watching,
                },
            ],
            status: 'online',
        } )

        //Get the config file for the server and change the channel name to the amount of users in the server

        setInterval( async () => {
            client.guilds.cache.forEach( async ( guild ) => {
                const [ dbguild ] = await Guild.findOrCreate( {
                    where: {
                        guildId: guild.id,
                    },
                } )

                //Get all online users from guild
                await guild.members.fetch( { cache: true } )
                let onlineUsers = guild.members.cache.filter(
                    ( member ) =>
                        ( member.presence?.status === 'online' ||
                            member.presence?.status === 'idle' ||
                            member.presence?.status === 'dnd' ) &&
                        !member.user.bot
                ).size
                if ( await dbguild.onlineChannelId ) {
                    await guild.channels.edit( await dbguild.onlineChannelId, {
                        name: `Online: ${ onlineUsers }`,
                    } )
                }
                if ( await dbguild.allChannelId ) {
                    await guild.channels.edit( await dbguild.allChannelId, {
                        name: `Members: ${ guild.memberCount }`,
                    } )
                }
                if ( await dbguild.botChannelId ) {
                    await guild.channels.edit( await dbguild.botChannelId, {
                        name: `Bots: ${ guild.members.cache.filter(
                            ( member ) => member.user.bot
                        ).size
                            }`,
                    } )
                }
            } )

            //Sets the bots status to the amount of servers it is in
            //#TODO: Fixes the bug where it sometimes doenst show a presence at all (Find the cause)

            serverAmount = await client.guilds.fetch( { cache: true } )

            client.user.setPresence( {
                activities: [
                    {
                        name: `${ serverAmount.size } server(s)`,
                        type: Watching,
                    },
                ],
                status: 'online',
            } )
        }, 1000 * 350 )
    },
}
