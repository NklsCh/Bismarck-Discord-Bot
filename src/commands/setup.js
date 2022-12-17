const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { TIMEOUT } = require('dns');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot")
    .setDescriptionLocalizations({
        "de": "Richte den Bot ein",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administratory),
    async execute(interaction) {
        //Search for server config
        if(fs.existsSync('./server-configs/' + interaction.guild.id + '.json') === false) return
        let config = JSON.parse(fs.readFileSync('./server-configs/' + interaction.guild.id + '.json', 'utf8'));

        //Ask user for language
        await interaction.reply('Choose a language: \r\n1. English\r\n2. Deutsch\rNote: You can always write "abort" to abort the setup');
        let filter = m => m.author.id === interaction.user.id;
        let collector = interaction.channel.createMessageCollector({ filter, time
        : 15000 });
        collector.on('collect', m => {
            if(m.content === "1") {
                interaction.guild.channels.cache.get(interaction.channel.id).send("English");
                interaction.guild.channels.cache.get(interaction.channel.id).send("Please enter the welcome channel id");
                filter = m => m.author.id === interaction.user.id;
                collector = interaction.channel.createMessageCollector({ filter, time
                : 15000 });
                collector.on('collect', m => {
                    if(m.content === "abort") {
                        interaction.guild.channels.cache.get(interaction.channel.id).send("Setup aborted");
                        collector.stop();
                        return
                    }
                    config.joinChannel = m.content;
                    fs.writeFileSync('./server-configs/' + interaction.guild.id + '.json', JSON.stringify(config, null, 4));
                    collector.stop()
                    interaction.guild.channels.cache.get(interaction.channel.id).send("Welcome channel set to " + m.content);
                })

                //Show goodbye channel setup if welcome channel setup is done
                interaction.guild.channels.cache.get(interaction.channel.id).send("Please enter the goodbye channel id");
                filter = m => m.author.id === interaction.user.id;
                collector = interaction.channel.createMessageCollector({ filter, time
                : 15000 });
                collector.on('collect', m => {
                    if(m.content === "abort") {
                        interaction.guild.channels.cache.get(interaction.channel.id).send("Setup aborted");
                        collector.stop();
                        return
                    }
                    interaction.guild.channels.cache.get(interaction.channel.id).send("Goodbye channel set to " + m.content);
                    config.leftChannel = m.content;
                    fs.writeFileSync('./server-configs/' + interaction.guild.id + '.json', JSON.stringify(config, null, 4));
                    collector.stop();
                });
            } else if(m.content === "2") {
                interaction.guild.channels.cache.get(interaction.channel.id).send("Deutsch");
                interaction.guild.channels.cache.get(interaction.channel.id).send("Bitte gebe die Willkommenschannel ID ein");
                filter = m => m.author.id === interaction.user.id;
                collector = interaction.channel.createMessageCollector({ filter, time
                : 15000 });
                collector.on('collect', m => {
                    if(m.content === "abort") {
                        interaction.guild.channels.cache.get(interaction.channel.id).send("Setup abgebrochen");
                        collector.stop();
                        return
                    }
                    interaction.guild.channels.cache.get(interaction.channel.id).send("Willkommenschannel gesetzt auf " + m.content);
                    config.joinChannel = m.content;
                    fs.writeFileSync('./server-configs/' + interaction.guild.id + '.json', JSON.stringify(config, null, 4));
                    collector.stop();
                }
                );
                if(config.joinChannel) {
                    //Ask user for goodbye channel
                    interaction.guild.channels.cache.get(interaction.channel.id).send("Bitte gebe die Verabschiedungschannel ID ein");
                    filter = m => m.author.id === interaction.user.id;
                    collector = interaction.channel.createMessageCollector({ filter, time
                    : 15000 });
                    collector.on('collect', m => {
                        if(m.content === "abort") {
                            interaction.guild.channels.cache.get(interaction.channel.id).send("Setup abgebrochen");
                            collector.stop();
                            return
                        }
                        interaction.guild.channels.cache.get(interaction.channel.id).send("Verabschiedungschannel gesetzt auf " + m.content);
                        config.leftChannel = m.content;
                        fs.writeFileSync('./server-configs/' + interaction.guild.id + '.json', JSON.stringify(config, null, 4));
                        collector.stop();
                    });
                }
            } else if(m.content === "abort") {
                collector.stop();
                return
            }
        });
    }
}