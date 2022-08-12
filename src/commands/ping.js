const { SlashCommandBuilder } = require('discord.js');

const { responseCommand} = require('../functions/embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with API Latency'),
	async execute(interaction) {
        const fields = { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
        return responseCommand(interaction, 'Ping', fields, null, false);
	},
};