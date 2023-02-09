require("dotenv").config();
const fs = require("fs")
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const commands = [];

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    commands.push(command.data.toJSON());
})

const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID),
    {body: commands})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error)

//Delete a specific command by its ID

/* rest.delete(Routes.applicationCommand(process.env.DISCORD_APPLICATION_ID, ''))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error); */

//Delete all commands

/* rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID), { body: [] })
.then(() => console.log('Successfully deleted all application commands.'))
.catch(console.error); */