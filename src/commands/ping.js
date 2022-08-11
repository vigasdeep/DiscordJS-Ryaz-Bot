const { SlashCommandBuilder } = require('discord.js');

const { responseCommand, embedCommand } = require('../functions/embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with API Latency'),
	async execute(interaction,client) {
        const fields = { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
        return responseCommand(client,interaction, 'Ping', fields, null, false);
	},
};