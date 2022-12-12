require("dotenv").config();
const fs = require("fs");
const { Client, Collection, ActivityType, GatewayIntentBits, PermissionsBitField} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.data.name, command);
})

client.once("ready", () => {
    console.log("Bot is ready!");;
    client.user.setPresence({
        activities: [{
            name: `${client.guilds.cache.get(process.env.DISCORD_GUILD_ID).memberCount} members`,
            type: ActivityType.Watching
        }],
        status: "online"
    })
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand() && !interaction.isButton()) return;
    
    const command = client.commands.get(interaction.commandName);
    
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    } 
    
    if(interaction.isButton()) {
        switch(interaction.customId) {
            case "kick":
                if(interaction.member.permissions.has(PermissionsBitField.ADMINISTRATOR)) {
                    await interaction.reply({ephemeral: true, content: "Kicked"});
                } else {
                    await interaction.reply({ephemeral: true, content: "Kick Button Clicked!"});
                }
                break;
            case "ban":
                await interaction.reply({ephemeral: true, content: "Ban Button Clicked!"});
                break;
            case "mute":
                await interaction.reply({ephemeral: true, content: "Mute Button Clicked!"});
                break;
            default:
                await interaction.reply({ephemeral: true, content: "Button Clicked!"});
        }
    }

});


client.login(process.env.TOKEN);