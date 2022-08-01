
const { EmbedBuilder } = require('discord.js');
const embedCommand = (title, fields, description) => {
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x4ce4b1)
        .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
        .setTimestamp()
        .setFooter({ text: 'Ryaz DiscordJS Bot' });
    if (description != null) {
        exampleEmbed.setDescription(description);
    }
    if (fields != null) {
        exampleEmbed.addFields(fields);
    }
    if (title != null) {
        exampleEmbed.setTitle(title);
    }
    return exampleEmbed;
}

const responseCommand = (interaction, title, fields, description, ephemeral) => {
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x4ce4b1)

        .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
        .setTimestamp()
        .setFooter({ text: 'Ryaz DiscordJS Bot' });
    if (description !== null) {
        exampleEmbed.setDescription(description);
    }
    if (fields !== null) {
        exampleEmbed.addFields(fields);
    }
    if (title !== null) {
        exampleEmbed.setTitle(title);
    }
    new_ephemeral = ephemeral;
    interaction.reply({ embeds: [exampleEmbed], ephemeral: new_ephemeral });
}

module.exports = {
    responseCommand: responseCommand,
    embedCommand :embedCommand
};