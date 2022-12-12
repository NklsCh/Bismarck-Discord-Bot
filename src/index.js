require("dotenv").config();
const fs = require("fs");
const { Client, Collection, ActivityType, GatewayIntentBits, Message } = require("discord.js");

const client = new Client({
    intents: []
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.data.name, command);
})

client.once("ready", () => {
    console.log("Bot is ready!");
    client.user.setPresence({
        activities: [{
            name: "with Discord.js",
            type: ActivityType.PLAYING
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
        if(interaction.customId === "invite"){
            await interaction.reply("Invite Button Clicked!");
        }
    }
});


client.login(process.env.TOKEN);