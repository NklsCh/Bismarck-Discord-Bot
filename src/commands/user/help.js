const {
    SlashCommandBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
} = require( 'discord.js' );
const fs = require( 'fs' );
const langData = require( '../../../resources/translations/lang.json' );

const COMMANDS_PER_PAGE = 6;

async function handleInteraction( i, action ) {
    try {
        await i.deferUpdate();
        await action();
    } catch ( error ) {
        if ( error.code === 10062 ) {
            try {
                await i.followUp( {
                    content: 'The menu has expired. Please run the help command again.',
                    ephemeral: true
                } );
            } catch ( e ) {
                console.error( 'Error sending followUp:', e );
            }
        } else {
            console.error( 'Error handling interaction:', error );
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'help' )
        .setDescription( langData.en.help.command.description )
        .setDescriptionLocalizations( {
            de: langData.de.help.command.description,
        } ),

    async execute( interaction ) {
        try {
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId( 'category' )
                .setPlaceholder( 'Select command category' )
                .addOptions( [
                    {
                        label: 'User Commands',
                        value: 'user',
                        description: 'Commands available to all users'
                    },
                    {
                        label: 'Admin Commands',
                        value: 'admin',
                        description: 'Commands available to administrators'
                    }
                ] );

            const row = new ActionRowBuilder().addComponents( selectMenu );

            const initialMessage = await interaction.reply( {
                components: [ row ],
                ephemeral: true,
                fetchReply: true
            } );

            const collector = initialMessage.createMessageComponentCollector( {
                time: 300000
            } );

            let currentPages = [];
            let currentPageIndex = 0;

            collector.on( 'collect', async i => {
                if ( i.user.id !== interaction.user.id ) {
                    await i.reply( {
                        content: 'You cannot use this menu.',
                        ephemeral: true
                    } );
                    return;
                }

                if ( i.customId === 'category' ) {
                    await handleInteraction( i, async () => {
                        const folder = i.values[ 0 ];
                        const commandFiles = fs.readdirSync( `./src/commands/${ folder }` )
                            .filter( file => file.endsWith( '.js' ) );

                        const commandFields = [];

                        for ( const file of commandFiles ) {
                            const command = require( `../../commands/${ folder }/${ file }` );
                            if ( !command.data ) continue;

                            commandFields.push( {
                                name: `/${ command.data.name }`,
                                value: command.data.description || 'No description available',
                                inline: true
                            } );
                        }

                        currentPages = [];
                        currentPageIndex = 0;

                        for ( let pageIndex = 0; pageIndex < commandFields.length; pageIndex += COMMANDS_PER_PAGE ) {
                            const embed = new EmbedBuilder()
                                .setColor( '#0099ff' )
                                .setTitle( `${ folder.charAt( 0 ).toUpperCase() + folder.slice( 1 ) } Commands` )
                                .setTimestamp();

                            const pageFields = commandFields.slice( pageIndex, pageIndex + COMMANDS_PER_PAGE );
                            pageFields.forEach( field => embed.addFields( field ) );

                            const padding = pageFields.length % 3;
                            if ( padding !== 0 ) {
                                for ( let j = 0; j < 3 - padding; j++ ) {
                                    embed.addFields( { name: '\u200b', value: '\u200b', inline: true } );
                                }
                            }

                            embed.setFooter( {
                                text: `Page ${ currentPages.length + 1 }/${ Math.ceil( commandFields.length / COMMANDS_PER_PAGE ) }`
                            } );
                            currentPages.push( embed );
                        }

                        if ( currentPages.length === 0 ) {
                            await i.editReply( {
                                content: `No commands found in ${ folder } category.`,
                                components: [ row ],
                                embeds: []
                            } );
                            return;
                        }

                        if ( currentPages.length === 1 ) {
                            await i.editReply( {
                                embeds: [ currentPages[ 0 ] ],
                                components: [ row ]
                            } );
                            return;
                        }

                        const buttonRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId( 'prev' )
                                .setLabel( 'Previous' )
                                .setStyle( ButtonStyle.Primary )
                                .setDisabled( true ),
                            new ButtonBuilder()
                                .setCustomId( 'next' )
                                .setLabel( 'Next' )
                                .setStyle( ButtonStyle.Primary )
                                .setDisabled( false )
                        );

                        await i.editReply( {
                            embeds: [ currentPages[ 0 ] ],
                            components: [ row, buttonRow ]
                        } );
                    } );

                } else if ( i.customId === 'prev' || i.customId === 'next' ) {
                    await handleInteraction( i, async () => {
                        currentPageIndex = i.customId === 'prev' ?
                            currentPageIndex - 1 :
                            currentPageIndex + 1;

                        const buttonRow = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId( 'prev' )
                                .setLabel( 'Previous' )
                                .setStyle( ButtonStyle.Primary )
                                .setDisabled( currentPageIndex === 0 ),
                            new ButtonBuilder()
                                .setCustomId( 'next' )
                                .setLabel( 'Next' )
                                .setStyle( ButtonStyle.Primary )
                                .setDisabled( currentPageIndex === currentPages.length - 1 )
                        );

                        await i.editReply( {
                            embeds: [ currentPages[ currentPageIndex ] ],
                            components: [ row, buttonRow ]
                        } );
                    } );
                }
            } );

            collector.on( 'end', () => {
                selectMenu.setDisabled( true );
                row.components[ 0 ] = selectMenu;

                initialMessage.edit( {
                    components: [ row ]
                } ).catch( () => { } );
            } );

        } catch ( error ) {
            console.error( 'Error in help command:', error );
            if ( !interaction.replied ) {
                await interaction.reply( {
                    content: 'An error occurred while processing your request.',
                    ephemeral: true
                } );
            }
        }
    }
};