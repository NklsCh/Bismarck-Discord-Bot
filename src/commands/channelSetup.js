const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("Setup the bot")
        .setDescriptionLocalizations({
            de: "Richte den Bot ein",
        })
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("set")
                .setDescription("Setup notification channels")
                .setDescriptionLocalizations({
                    de: "Richte die Benachrichtigungschannel ein",
                })
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("join")
                        .setDescription("Setup the channel for join messages")
                        .setDescriptionLocalizations({
                            de: "Richte den Join Channel ein",
                        })
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "The channel where the join messages should be sent"
                                )
                                .setDescriptionLocalizations({
                                    de: "Der Channel in dem die Join Nachrichten gesendet werden sollen",
                                })
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("leave")
                        .setDescription("Setup the leave channel")
                        .setDescriptionLocalizations({
                            de: "Richte den Leave Channel ein",
                        })
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to set")
                                .setDescriptionLocalizations({
                                    de: "Der Channel der gesetzt werden soll",
                                })
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("unset")
                .setDescription("Unset notification channels")
                .setDescriptionLocalizations({
                    de: "Entferne die Benachrichtigungschannel",
                })
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("join")
                        .setDescription("Unset the join channel")
                        .setDescriptionLocalizations({
                            de: "Entferne den Join Channel",
                        })
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("leave")
                        .setDescription("Unset the leave channel")
                        .setDescriptionLocalizations({
                            de: "Entferne den Leave Channel",
                        })
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        //Get server config
        let serverConfig = JSON.parse(
            fs.readFileSync(`./config/${interaction.guild.id}.json`)
        );

        //Switch the subcommand group whether it is set or unset
        switch (interaction.options.getSubcommandGroup()) {
            case "unset":
                //Switch the subcommand whether it is join or leave
                switch (interaction.options.getSubcommand()) {
                    case "join":
                        //Set the join channel to null and save the config
                        serverConfig.joinChannel = null;
                        fs.writeFileSync(
                            `./config/${interaction.guild.id}.json`,
                            JSON.stringify(serverConfig, null, 4)
                        );
                        //Reply's the user that the join channel has been unset
                        interaction.reply({
                            content: `Join channel unset`,
                            ephemeral: true,
                        });
                        break;
                    case "leave":
                        serverConfig.leftChannel = null;
                        fs.writeFileSync(
                            `./config/${interaction.guild.id}.json`,
                            JSON.stringify(serverConfig, null, 4)
                        );
                        interaction.reply({
                            content: `Leave channel unset`,
                            ephemeral: true,
                        });
                        break;
                }
                break;
            case "set":
                switch (interaction.options.getSubcommand()) {
                    case "join":
                        const joinChannel =
                            interaction.options.getChannel("channel");
                        serverConfig.joinChannel = joinChannel.id;
                        fs.writeFileSync(
                            `./config/${interaction.guild.id}.json`,
                            JSON.stringify(serverConfig, null, 4)
                        );
                        interaction.reply({
                            content: `Join channel set to ${joinChannel}`,
                            ephemeral: true,
                        });
                        break;
                    case "leave":
                        const leaveChannel =
                            interaction.options.getChannel("channel");
                        serverConfig.leftChannel = leaveChannel.id;
                        fs.writeFileSync(
                            `./config/${interaction.guild.id}.json`,
                            JSON.stringify(serverConfig, null, 4)
                        );
                        interaction.reply({
                            content: `Leave channel set to ${leaveChannel}`,
                            ephemeral: true,
                        });
                        break;
                }
                break;
        }
    },
};
