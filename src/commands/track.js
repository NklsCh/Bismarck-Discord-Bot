const {
    PermissionFlagsBits,
    EmbedBuilder,
    SlashCommandBuilder,
    ChannelType,
} = require("discord.js");
const Guilds = require("../../models/guilds.js");

let channel, serverConfig;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("track")
        .setDescription(
            "Configures the bot to track the amount of users in a server"
        )
        .setDescriptionLocalizations({
            de: "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen",
        })
        .addSubcommandGroup((group) =>
            group
                .setName("add")
                .setDescription(
                    "Configures the bot to track the amount of users in a server"
                )
                .setDescriptionLocalizations({
                    de: "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen",
                })
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("online")
                        .setDescription(
                            "Configures the bot to track the amount of online users in a server"
                        )
                        .setDescriptionLocalizations({
                            de: "Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen, welche online sind",
                        })
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "The channel to track the amount of users in"
                                )
                                .setDescriptionLocalizations({
                                    de: "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll",
                                })
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildVoice)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("all")
                        .setDescription(
                            "Configures the bot to track the amount of all users in a server"
                        )
                        .setDescriptionLocalizations({
                            de: "Konfiguriert den Bot, um die Anzahl aller Benutzer in einem Server zu verfolgen",
                        })
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "The channel to track the amount of users in"
                                )
                                .setDescriptionLocalizations({
                                    de: "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll",
                                })
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildVoice)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("bots")
                        .setDescription(
                            "Configures the bot to track the amount of bots in a server"
                        )
                        .setDescriptionLocalizations({
                            de: "Konfiguriert den Bot, um die Anzahl der Bots in einem Server zu verfolgen",
                        })
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "The channel to track the amount of users in"
                                )
                                .setDescriptionLocalizations({
                                    de: "Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll",
                                })
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildVoice)
                        )
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName("remove")
                .setDescription(
                    "Removes the tracking of the amount of users in a server"
                )
                .setDescriptionLocalizations({
                    de: "Entfernt die Verfolgung der Anzahl der Benutzer in einem Server",
                })
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("online")
                        .setDescription(
                            "Removes the tracking of the amount of online users in a server"
                        )
                        .setDescriptionLocalizations({
                            de: "Entfernt die Verfolgung der Anzahl der Benutzer in einem Server welche online sind",
                        })
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("all")
                        .setDescription(
                            "Removes the tracking of the amount of all users in a server"
                        )
                        .setDescriptionLocalizations({
                            de: "Entfernt die Verfolgung der Anzahl aller Benutzer in einem Server",
                        })
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("bots")
                        .setDescription(
                            "Removes the tracking of the amount of bots in a server"
                        )
                        .setDescriptionLocalizations({
                            de: "Entfernt die Verfolgung der Anzahl der Bots in einem Server",
                        })
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("list")
                .setDescription(
                    "Lists all channels the bot is tracking the amount of users in"
                )
                .setDescriptionLocalizations({
                    de: "Listet alle Kanäle auf, in denen der Bot die Anzahl der Benutzer verfolgt",
                })
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const [guild] = await Guilds.findOrCreate({
            where: { guildId: interaction.guild.id },
        });
        channel = interaction.options.getChannel("channel");
        switch (
            interaction.options.getSubcommandGroup() ||
            interaction.options.getSubcommand()
        ) {
            case "add":
                switch (interaction.options.getSubcommand()) {
                    case "online":
                        await interaction.deferReply({ ephemeral: true });
                        await guild.update({
                            onlineChannelId: channel.id,
                        });
                        interaction.editReply({
                            content: `The bot will now track the amount of online users in ${channel}!`,
                        });
                        break;
                    case "all":
                        await interaction.deferReply({ ephemeral: true });
                        await guild.update({
                            allChannelId: channel.id,
                        });
                        interaction.editReply({
                            content: `The bot will now track the amount of all users in ${channel}!`,
                            ephemeral: true,
                        });
                        break;
                    case "bots":
                        await interaction.deferReply({ ephemeral: true });
                        await guild.update({
                            botChannelId: channel.id,
                        });
                        interaction.editReply({
                            content: `The bot will now track the amount of bots in ${channel}!`,
                            ephemeral: true,
                        });
                }
                break;
            case "remove":
                switch (interaction.options.getSubcommand()) {
                    case "online":
                        await interaction.deferReply({ ephemeral: true });
                        await guild.update({
                            onlineChannelId: null,
                        });
                        interaction.editReply({
                            content:
                                "The bot will no longer track the amount of online users!",
                            ephemeral: true,
                        });
                        break;
                    case "all":
                        await interaction.deferReply({ ephemeral: true });
                        await guild.update({
                            allChannelId: null,
                        });
                        interaction.editReply({
                            content:
                                "The bot will no longer track the amount of all users!",
                            ephemeral: true,
                        });
                        break;
                    case "bots":
                        await interaction.deferReply({ ephemeral: true });
                        await guild.update({
                            botChannelId: null,
                        });
                        interaction.editReply({
                            content:
                                "The bot will no longer track the amount of bots!",
                            ephemeral: true,
                        });
                        break;
                }
                break;
            case "list":
                await interaction.deferReply({ ephemeral: true });
                let onlineChannelName, allChannelName, botChannelName;
                if (!guild.onlineChannelId) {
                    onlineChannelName = "Not tracking";
                } else {
                    onlineChannelName = await interaction.guild.channels.fetch(
                        guild.onlineChannelId
                    );
                }
                if (!guild.allChannelId) {
                    allChannelName = "Not tracking";
                } else {
                    allChannelName = await interaction.guild.channels.fetch(
                        guild.allChannelId
                    );
                }
                if (!guild.onlineChannelId) {
                    botChannelName = "Not tracking";
                } else {
                    botChannelName = await interaction.guild.channels.fetch(
                        guild.botChannelId
                    );
                }
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Tracking Channels")
                            .setFields([
                                {
                                    name: "Online",
                                    value: `${onlineChannelName}`,
                                    inline: true,
                                },
                                {
                                    name: "All",
                                    value: `${allChannelName}`,
                                    inline: true,
                                },
                                {
                                    name: "Bots",
                                    value: `${botChannelName}`,
                                    inline: true,
                                },
                            ]),
                    ],
                    ephemeral: true,
                });
                break;
        }
    },
};
