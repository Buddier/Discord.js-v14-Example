
// Example of how to make a Command

module.exports = {
    name: "ping",
    aliases: ["pong", "latency"],
    category: "Utility",
    description: "Check the bot's ping!",
    ownerOnly: false,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param String[] args 
     */
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`);

        const pingEmbed = new client.discord.EmbedBuilder()
            .setTitle(':signal_strength: Bot Ping')
            .addFields(
                {
                    name: "Time",
                    value: `${Math.floor(msg.createdAt - message.createdAt)}ms`,
                    inline: true
                },
                {
                    name: "API Ping",
                    value: `${client.ws.ping}ms`,
                    inline: true
                }
            )
            .setColor(client.config.embedColor)
            .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await message.reply({ allowedMentions: { repliedUser: false }, embeds: [pingEmbed] });

        msg.delete();
    }
};
