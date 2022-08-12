
const { EmbedBuilder } = require('discord.js');

const embedCommand = (interaction,title, fields, description) => {
    
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x4ce4b1)
        .setAuthor({ name: `${interaction.client.user.username}`, iconURL: ` https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240` })
        .setTimestamp()
        .setFooter({ text: `${interaction.client.user.username}` });
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
        .setAuthor({ name: `${interaction.client.user.username}`, iconURL: ` https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240` })
        .setTimestamp()
        .setFooter({ text: `${interaction.client.user.username}` });
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
    return interaction.reply({ embeds: [exampleEmbed], ephemeral: new_ephemeral });
}

const messageEmbedCommand = (message,title, fields, description) => {
    
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x4ce4b1)
        .setAuthor({ name: `${message.client.user.username}`, iconURL: ` https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240` })
        .setTimestamp()
        .setFooter({ text: `${message.client.user.username}` });
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

module.exports = {
    responseCommand: responseCommand,
    embedCommand :embedCommand,
    messageEmbedCommand: messageEmbedCommand
};