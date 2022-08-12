const { SlashCommandBuilder } = require('discord.js');
const { responseCommand  } = require('../functions/embed');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Display info about this server.'),
	async execute(interaction) {
		const fields = [{ name: 'Server Name', value: `${interaction.guild.name}`, inline: true }, { name: 'Total members', value: `${interaction.guild.memberCount}`, inline: true }]
        return responseCommand(interaction, 'Server Information', fields, null, false);
	},
};