const { readdirSync } = require("fs");
const { ApplicationCommandOptionType } = require('discord.js');

// Example of how to make a Help SlashCommand

module.exports = {
    name: "help",
    usage: '/help <command>',
    options: [
        {
            name: 'command',
            description: 'What command do you need help',
            // https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    category: "Bot",
    description: "Return all commands, or one specific command!",
    ownerOnly: false,
    run: async (client, interaction) => {

        // Buttons that take you to a link
        // If you want to delete them, remove this part of
        // the code and in line: 62 delete ", components: [row]"
        const row = new client.discord.ActionRowBuilder()
            .addComponents(
                new client.discord.ButtonBuilder()
                    .setLabel("GitHub")
                    .setStyle(client.discord.ButtonStyle.Link)
                    .setURL("http://github.com/Buddier/Discord.js-v14-Example"),
                new client.discord.ButtonBuilder()
                    .setLabel("Support")
                    .setStyle(client.discord.ButtonStyle.Link)
                    .setURL("http://dsc.gg/faithcommunity")
            );

        const commandInt = interaction.options.getString("command");
        if (!commandInt) {

            // Get the commands of a Bot category
            const botCommandsList = [];
            readdirSync(`${client.cwd}/src/commands/slash/Bot`).forEach((file) => {
                const filen = require(`${client.cwd}/src/commands/slash/Bot/${file}`);
                const name = `\`${filen.name}\``;
                botCommandsList.push(name);
            });

            // Get the commands of a Utility category
            const utilityCommandsList = [];
            readdirSync(`${client.cwd}/src/commands/slash/Utility`).forEach((file) => {
                const filen = require(`${client.cwd}/src/commands/slash/Utility/${file}`);
                const name = `\`${filen.name}\``;
                utilityCommandsList.push(name);
            });

            // This is what it commands when using the command without arguments
            const helpEmbed = new client.discord.EmbedBuilder()
                .setTitle(`${client.user.username} SlashHelp`)
                .setDescription(` Hello **<@${interaction.member.id}>**, I am <@${client.user.id}>.  \nYou can use \`/help <slash_command>\` to see more info about the SlashCommands!\n**Total Commands:** ${client.commands.size}\n**Total SlashCommands:** ${client.slash.size}`)
                .addFields(
                    {
                        name: "🤖 - Bot SlashCommands",
                        value: botCommandsList.map((data) => `${data}`).join(", "),
                        inline: true
                    },
                    {
                        name: "🛠 - Utility SlashCommands",
                        value: utilityCommandsList.map((data) => `${data}`).join(", "),
                        inline: true
                    }
                )
                .setColor(client.config.embedColor)
                .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

            interaction.reply({ embeds: [helpEmbed], components: [row] });
        } else {
            const command = client.slash.get(commandInt.toLowerCase());

            // This is what it sends when using the command with argument and it does not find the command
            if (!command) {
                interaction.reply({ content: `There isn't any SlashCommand named "${commandInt}"` });
            } else {

                // This is what it sends when using the command with argument and if it finds the command
                let command = client.slash.get(commandInt.toLowerCase());
                let name = command.name;
                let description = command.description || "No descrpition provided"
                let usage = command.usage || "No usage provided"
                let category = command.category || "No category provided!"

                let helpCmdEmbed = new client.discord.EmbedBuilder()
                    .setTitle(`${client.user.username} Help | \`${(name.toLocaleString())}\` SlashCommand`)
                    .addFields(
                        {
                            name: "Description",
                            value: `${description}`
                        },
                        {
                            name: "Usage",
                            value: `${usage}`
                        },
                        {
                            name: 'Category',
                            value: `${category}`
                        }
                    )
                    .setColor(client.config.embedColor)
                    .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

                interaction.reply({ embeds: [helpCmdEmbed] });
            }
        }
    }
};
