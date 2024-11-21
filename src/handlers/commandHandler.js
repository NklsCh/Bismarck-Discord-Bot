const fs = require( 'fs' );

module.exports = async ( client ) => {
    try {
        const startTime = Date.now();

        const commandFolders = await fs.promises.readdir( './src/commands' );

        for ( const folder of commandFolders ) {
            const commandFiles = await fs.promises.readdir( `./src/commands/${ folder }` );
            const filteredFiles = commandFiles.filter( ( file ) => file.endsWith( '.js' ) );

            for ( const commandFile of filteredFiles ) {
                const command = await require( `../commands/${ folder }/${ commandFile }` );
                client.commands.set( command.data.name, command );
            }
        }

        const loadingTime = Date.now() - startTime;
        console.log( `Commands loaded! (${ loadingTime } ms)` );
    } catch ( error ) {
        console.error( 'Error in the command handler', error );
    }
};
