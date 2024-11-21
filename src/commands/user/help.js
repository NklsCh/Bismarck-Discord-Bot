const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    REST,
    Routes,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} = require( 'discord.js' );
const fs = require( 'fs' );
const makeHelpEmbed = require( '../../functions/helpEmbedCreator' );
const langData = require( '../../../resources/translations/lang.json' );

const COMMANDS_PER_PAGE = 6;

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'help' )
        .setDescription( langData.en.help.command.description )
        .setDescriptionLocalizations( {
            de: langData.de.help.command.description,
        } ),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute( interaction ) {
        try {
            const rest = new REST( { version: '10' } ).setToken( process.env.TOKEN );
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId( 'category' )
                .setPlaceholder( 'Select command category' )
                .addOptions( [
                    { label: 'User Commands', value: 'user' },
                    { label: 'Admin Commands', value: 'admin' }
                ] );

            const initialResponse = await interaction.reply( {
                components: [ new ActionRowBuilder().addComponents( selectMenu ) ],
                ephemeral: true
            } );

            const categoryCollector = initialResponse.createMessageComponentCollector( {
                componentType: ComponentType.StringSelect,
                time: 30000
            } );

            categoryCollector.on( 'collect', async i => {
                const folder = i.values[ 0 ];
                const commandFields = [];

                const commandFiles = fs.readdirSync( `./src/commands/${ folder }` )
                    .filter( file => file.endsWith( '.js' ) );

                const commands = await rest.get(
                    Routes.applicationCommands( process.env.DISCORD_APPLICATION_ID )
                );

                commandFiles.forEach( file => {
                    const f = require( `../../commands/${ folder }/${ file }` );
                    commands.forEach( command => {
                        if ( command.name === 'Info' || f.data.name !== command.name ) return;

                        if ( !command.options?.some( opt => opt.type === 2 ) ) {
                            commandFields.push( {
                                name: `</${ command.name }:${ command.id }>`,
                                value: command.description || 'No description',
                                inline: true
                            } );
                        }

                        command.options?.forEach( option => {
                            if ( option.type === 2 ) {
                                option.options?.forEach( subOption => {
                                    commandFields.push( {
                                        name: `</${ command.name } ${ option.name } ${ subOption.name }:${ command.id }>`,
                                        value: subOption.description || 'No description',
                                        inline: true
                                    } );
                                } );
                            }
                        } );
                    } );
                } );

                const pages = [];
                for ( let i = 0; i < commandFields.length; i += COMMANDS_PER_PAGE ) {
                    const embed = makeHelpEmbed( interaction, folder );
                    const chunk = commandFields.slice( i, i + COMMANDS_PER_PAGE );

                    while ( chunk.length % 3 !== 0 ) {
                        chunk.push( { name: '\u200b', value: '\u200b', inline: true } );
                    }

                    for ( let j = 0; j < chunk.length; j += 3 ) {
                        embed.addFields( chunk.slice( j, j + 3 ) );
                        if ( j + 3 < chunk.length ) {
                            embed.addFields( { name: '\u200b', value: '\u200b', inline: false } );
                        }
                    }

                    embed.setFooter( {
                        text: `${ folder.charAt( 0 ).toUpperCase() + folder.slice( 1 ) } Commands - Page ${ pages.length + 1 }/${ Math.ceil( commandFields.length / COMMANDS_PER_PAGE ) }`
                    } );
                    pages.push( embed );
                }

                let currentPage = 0;
                const navigation = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId( 'prev' )
                        .setLabel( 'Previous' )
                        .setStyle( ButtonStyle.Primary )
                        .setDisabled( true ),
                    new ButtonBuilder()
                        .setCustomId( 'next' )
                        .setLabel( 'Next' )
                        .setStyle( ButtonStyle.Primary )
                        .setDisabled( pages.length <= 1 )
                );

                const categoryRow = new ActionRowBuilder().addComponents( selectMenu );

                const response = await i.update( {
                    embeds: [ pages[ 0 ] ],
                    components: pages.length > 1 ? [ categoryRow, navigation ] : [ categoryRow ]
                } );

                if ( pages.length > 1 ) {
                    const pageCollector = response.createMessageComponentCollector( {
                        componentType: ComponentType.Button,
                        time: 300000
                    } );

                    pageCollector.on( 'collect', async btn => {
                        currentPage = btn.customId === 'prev' ? currentPage - 1 : currentPage + 1;

                        const buttons = navigation.components;
                        buttons[ 0 ].setDisabled( currentPage === 0 );
                        buttons[ 1 ].setDisabled( currentPage === pages.length - 1 );

                        await btn.update( {
                            embeds: [ pages[ currentPage ] ],
                            components: [ categoryRow, navigation ]
                        } );
                    } );

                    pageCollector.on( 'end', async () => {
                        navigation.components.forEach( button => button.setDisabled( true ) );
                        await response.edit( { components: [ categoryRow, navigation ] } ).catch( console.error );
                    } );
                }
            } );

            categoryCollector.on( 'end', async ( collected, reason ) => {
                if ( reason === 'time' && collected.size === 0 ) {
                    await initialResponse.edit( {
                        content: 'Help command timed out. Please run the command again.',
                        components: []
                    } );
                }
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
    },
};