const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require("discord.js");
const fs = require("fs");

let channel, serverConfig;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("Configures the bot to track the amount of users in a server")
    .setDescriptionLocalizations({
        "de": "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen",
    })
    .addSubcommand(subcommand => subcommand
        .setName("online")
        .setDescription("Trackes the amount of online users in a server")
        .setDescriptionLocalizations({
            "de": "Verfolgt die Anzahl der Benutzer in einem Server welche online sind"
        })
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("The channel to track the amount of users in")
            .setDescriptionLocalizations({
                "de": "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll"
            })
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("all")
        .setDescription("Tracks the amount of all users in a server")
        .setDescriptionLocalizations({
            "de": "Verfolgt die Anzahl aller Benutzer in einem Server"
        })
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("The channel to track the amount of users in")
            .setDescriptionLocalizations({
                "de": "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll"
            })
            .setRequired(true)
        )
    ),
    async execute(interaction) {
        let isAdmin
        try {
            isAdmin = interaction.member.permissions.has(PermissionsBitField.ADMINISTRATOR);
        } catch (error) {
            isAdmin = false;
        }
        if(isAdmin){
            serverConfig = JSON.parse(fs.readFileSync(`./server-configs/${interaction.guild.id}.json`));
            channel = interaction.options.getChannel("channel");
            switch (interaction.options.getSubcommand()) {
                case "online":
                    if(!serverConfig.onlineChannel){
                        serverConfig.onlineChannel = channel.id;
                        fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig));
                        interaction.reply({ content: `The bot will now track the amount of online users in ${channel}!`, ephemeral: true });
                    } else {
                        interaction.reply({ content: "The bot is already tracking the amount of online users in a channel!", ephemeral: true });
                    }
                    break;
                case "all":
                    if(!serverConfig.allChannel){
                        serverConfig.allChannel = channel.id;
                        fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig));
                        interaction.reply({ content: `The bot will now track the amount of all users in ${channel}!`, ephemeral: true });
                    } else {
                        interaction.reply({ content: "The bot is already tracking the amount of all users in a channel!", ephemeral: true });
                    }
                    break;
            }
        } else {
            interaction.reply({ content: "You dont have the necessary permissions to execute that command", ephemeral: true });
        }
    }
}