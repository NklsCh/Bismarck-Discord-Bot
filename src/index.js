require("dotenv").config();
const fs = require("fs");
const { Client, Collection, GatewayIntentBits} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences, 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Command handler

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.data.name, command);
})

// Event handler

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

eventFiles.forEach(file => {
    const event = require(`./../events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

client.login(process.env.TOKEN).then(r => console.log(`Ready! Logged in as ${client.user.tag}`));