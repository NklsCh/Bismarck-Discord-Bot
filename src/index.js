const startTime = Date.now();
require( 'dotenv' ).config();
const fs = require( 'fs' );
const { Client, Collection, GatewayIntentBits } = require( 'discord.js' );

const REQUIRED_INTENTS = [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
];

const setupErrorHandlers = () => {
    process.on( 'unhandledRejection', ( reason, promise ) =>
        console.log( 'Unhandled Rejection at:', promise, 'reason:', reason ) );

    process.on( 'uncaughtException', ( err ) =>
        console.log( 'Uncaught Exception:', err ) );

    process.on( 'uncaughtExceptionMonitor', ( err, origin ) =>
        console.log( 'Uncaught Exception Monitor:', err, origin ) );
};

const loadHandlers = ( client ) => {
    const handlerFiles = fs.readdirSync( './src/handlers' )
        .filter( file => file.endsWith( '.js' ) );

    for ( const file of handlerFiles ) {
        require( `./handlers/${ file }` )( client );
    }
};

const initializeClient = async () => {
    const client = new Client( { intents: REQUIRED_INTENTS } );
    client.commands = new Collection();

    setupErrorHandlers();
    loadHandlers( client );

    await client.login( process.env.TOKEN );
    console.log( `Ready! Logged in as ${ client.user.tag } (${ Date.now() - startTime }ms)` );
};

initializeClient().catch( console.error );