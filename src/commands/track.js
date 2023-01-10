const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");

let channel, serverConfig;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("Configures the bot to track the amount of users in a server")
    .setDescriptionLocalizations({
        "de": "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen",
    })
    .addSubcommandGroup(group => group
        .setName("add")
        .setDescription("Configures the bot to track the amount of users in a server")
        .setDescriptionLocalizations({
            "de": "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen",
        })
        .addSubcommand(subcommand => subcommand
            .setName("online")
            .setDescription("Configures the bot to track the amount of online users in a server")
            .setDescriptionLocalizations({
                "de": "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen, welche online sind",
            })
            .addChannelOption(option =>
                option.setName("channel")
                .setDescription("The channel to track the amount of users in")
                .setDescriptionLocalizations({
                    "de": "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll",
                })
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("all")
            .setDescription("Configures the bot to track the amount of all users in a server")
            .setDescriptionLocalizations({
                "de": "Konfiguriert den Bot, um die Anzahl aller Benutzer in einem Server zu verfolgen",
            })
            .addChannelOption(option =>
                option.setName("channel")
                .setDescription("The channel to track the amount of users in")
                .setDescriptionLocalizations({
                    "de": "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll",
                })
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("bots")
            .setDescription("Configures the bot to track the amount of bots in a server")
            .setDescriptionLocalizations({
                "de": "Konfiguriert den Bot, um die Anzahl der Bots in einem Server zu verfolgen",
            })
            .addChannelOption(option =>
                option.setName("channel")
                .setDescription("The channel to track the amount of users in")
                .setDescriptionLocalizations({
                    "de": "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll",
                })
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(group => group
        .setName("remove")
        .setDescription("Removes the tracking of the amount of users in a server")
        .setDescriptionLocalizations({
            "de": "Entfernt die Verfolgung der Anzahl der Benutzer in einem Server"
            })
        .addSubcommand(subcommand => subcommand
            .setName("online")
            .setDescription("Removes the tracking of the amount of online users in a server")
            .setDescriptionLocalizations({
                "de": "Entfernt die Verfolgung der Anzahl der Benutzer in einem Server welche online sind"
            })
        )
        .addSubcommand(subcommand => subcommand
            .setName("all")
            .setDescription("Removes the tracking of the amount of all users in a server")
            .setDescriptionLocalizations({
                "de": "Entfernt die Verfolgung der Anzahl aller Benutzer in einem Server"
            })
        )
        .addSubcommand(subcommand => subcommand
            .setName("bots")
            .setDescription("Removes the tracking of the amount of bots in a server")
            .setDescriptionLocalizations({
                "de": "Entfernt die Verfolgung der Anzahl der Bots in einem Server"
            })
        )

    )
    .addSubcommand(subcommand => subcommand
        .setName("list")
        .setDescription("Lists all channels the bot is tracking the amount of users in")
        .setDescriptionLocalizations({
            "de": "Listet alle Kanäle auf, in denen der Bot die Anzahl der Benutzer verfolgt"
        })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    async execute(interaction) {
        serverConfig = JSON.parse(fs.readFileSync(`./server-configs/${interaction.guild.id}.json`));
        channel = interaction.options.getChannel("channel");
        switch (interaction.options.getSubcommandGroup() || interaction.options.getSubcommand()) {
            case "add":
                switch (interaction.options.getSubcommand()) {
                    case "online":
                        if(!serverConfig.onlineChannel){
                            serverConfig.onlineChannel = channel.id;
                            fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig, null, 4));
                            interaction.reply({ content: `The bot will now track the amount of online users in ${channel}!`, ephemeral: true });
                        } else {
                            interaction.reply({ content: "The bot is already tracking the amount of online users in a channel!", ephemeral: true });
                        }
                    break;
                    case "all":
                        if(!serverConfig.allChannel){
                            serverConfig.allChannel = channel.id;
                            fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig, null, 4));
                            interaction.reply({ content: `The bot will now track the amount of all users in ${channel}!`, ephemeral: true });
                        } else {
                            interaction.reply({ content: "The bot is already tracking the amount of all users in a channel!", ephemeral: true });
                        }
                    break;
                    case "bots":
                        if(!serverConfig.botChannel){
                            serverConfig.botChannel = channel.id;
                            fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig, null, 4));
                            interaction.reply({ content: `The bot will now track the amount of bots in ${channel}!`, ephemeral: true });
                        } else {
                            interaction.reply({ content: "The bot is already tracking the amount of bots in a channel!", ephemeral: true });
                        }
                }
                break;
            case "remove":
                switch (interaction.options.getSubcommand()) {
                    case "online":
                        if(serverConfig.onlineChannel){
                            delete serverConfig.onlineChannel;
                            fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig, null, 4));
                            interaction.reply({ content: "The bot will no longer track the amount of online users!", ephemeral: true });
                        } else {
                            interaction.reply({ content: "The bot is not tracking the amount of online users!", ephemeral: true });
                        }
                        break;
                    case "all":
                        if(serverConfig.allChannel){
                            delete serverConfig.allChannel;
                            fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig, null, 4));
                            interaction.reply({ content: "The bot will no longer track the amount of all users!", ephemeral: true });
                        }
                        break;
                    case "bots":
                        if(serverConfig.botChannel){
                            delete serverConfig.botChannel;
                            fs.writeFileSync(`./server-configs/${interaction.guild.id}.json`, JSON.stringify(serverConfig, null, 4));
                            interaction.reply({ content: "The bot will no longer track the amount of bots!", ephemeral: true });
                        } else {
                            interaction.reply({ content: "The bot is not tracking the amount of bots!", ephemeral: true });
                        }
                    break;
                }
                break;
            case "list":
                let onlineChannel = serverConfig.onlineChannel;
                let allChannel = serverConfig.allChannel;
                let botChannel = serverConfig.botChannel;
                let onlineChannelName, allChannelName, botChannelName;
                if(!onlineChannel) {
                    onlineChannelName = "Not tracking";
                } else {
                    onlineChannelName = await interaction.guild.channels.fetch(onlineChannel);  
                }
                if(!allChannel) {
                    allChannelName = "Not tracking";
                } else {
                    allChannelName = await interaction.guild.channels.fetch(allChannel);
                }
                if(!botChannel) {
                    botChannelName = "Not tracking";
                } else {
                    botChannelName = await interaction.guild.channels.fetch(botChannel);
                }
                interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Tracking Channels")
                    .setFields([
                        {
                            name: "Online",
                            value: `${onlineChannelName}`,
                            inline: true
                        },
                        {
                            name: "All",
                            value: `${allChannelName}`,
                            inline: true
                        },
                        {
                            name: "Bots",
                            value: `${botChannelName}`,
                            inline: true
                        }
                    ])
                ], ephemeral: true });
                break;
        }
    }
}