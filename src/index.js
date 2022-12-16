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
    
});

client.on("guildCreate", guild => {
    client.user.setPresence({
        activities: [{
            name: `${serverAmount.size} Server(s)`,
            type: ActivityType.Watching
        }],
        status: "online"
    })
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

//When a user joins the server
client.on("guildMemberAdd", member => {
    //Log the amount of users in the server
    console.log(`There are ${member.guild.memberCount} users in the server`);
    //Changes name of a channel to the amount of users in the server
    member.guild.channels.cache.get("1053423774780883075").setName(`Members: ${member.guild.memberCount}`);
})

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