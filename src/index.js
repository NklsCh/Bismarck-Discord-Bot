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

const serverAmount = client.guilds.cache;

client.once("ready", () => {
    console.log("Bot is ready!");;
    client.user.setPresence({
        activities: [{
            name: `${serverAmount.size} Server(s)`,
            type: ActivityType.Watching
        }],
        status: "online"
    })
    //Get the config file for the server and change the channel name to the amount of users in the server
    client.guilds.cache.forEach(guild => {
        //Get all online users from guild
        let onlineUsers = guild.members.cache.filter(member => member.presence?.status === "online" && !member.user.bot).size;
        let config = JSON.parse(fs.readFileSync('./server-configs/' + guild.id + '.json', 'utf8'));
        if(!config.onlineChannel) return;
        guild.channels.edit(config.onlineChannel, {name: `Online: ${onlineUsers}`});
        if(!config.allChannel) return;
        guild.channels.edit(config.allChannel, {name: `Members: ${guild.memberCount}`});
    })
});

client.on("guildCreate", guild => {
    client.user.setPresence({
        activities: [{
            name: `${serverAmount.size} Server(s)`,
            type: ActivityType.Watching
        }],
        status: "online"
    })
    fs.writeFileSync('./server-configs/' + guild.id + '.json', JSON.stringify({
        "name": guild.name,
    }))
});

client.on("guildDelete", guild => {
    client.user.setPresence({
        activities: [{
            name: `${serverAmount.size} Server(s)`,
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
        let isAdmin
        try {
            isAdmin = interaction.member.permissions.has(PermissionsBitField.ADMINISTRATOR);
        } catch (error) {
            isAdmin = false;
        }
        userid = interaction.message.embeds.map(embed => embed.footer.text)
        let user = interaction.guild.members.cache.find(user => user.id === userid[0])
        switch(interaction.customId) {
            case "kick":
                if(interaction.guild.members.cache.get(user.id).kickable) {
                    try {
                        await interaction.guild.members.cache.get(user.id).kick();
                    } catch (error) {}
                } else {
                    await interaction.reply({ephemeral: true, content: "I can't kick this user"});
                }
                interaction.reply({ephemeral: true, content: `The user ${user} has been kicked`});
                break;
            case "ban":
                if(interaction.guild.members.cache.get(user.id).bannable) {
                    try {
                        await interaction.guild.members.cache.get(user.id).ban();
                    } catch (error) {}
                } else {
                    await interaction.reply({ephemeral: true, content: "I can't ban this user"});
                }
                interaction.reply({ephemeral: true, content: `The user ${user} has been banned`});
                break;
            default:
                await interaction.reply({ephemeral: true, content: "Button Clicked!"});
                break;
        }
                
    }

});


client.login(process.env.TOKEN);