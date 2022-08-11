const { getCoins } = require('../functions/mongoDbCoins');
const { SlashCommandBuilder } = require('discord.js');
const { responseCommand } = require('../functions/embed');


module.exports = {
	data: new SlashCommandBuilder().setName('mycoins').setDescription('Shows available coins'),


	async execute(interaction,client) {
        id = interaction.user.id;
            coins = await getCoins(id);
            const title = 'My coins'
            const fields = [{ name: `Name: ${interaction.user.username}`, value: `Available Coins: ${coins}`, inline: true }]
           return responseCommand(client,interaction, title, fields, null, true);
	},
};