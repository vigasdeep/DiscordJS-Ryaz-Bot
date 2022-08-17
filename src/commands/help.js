const { SlashCommandBuilder } = require('discord.js');
const { responseCommand } = require('../functions/embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows the list of commands'),
	async execute(interaction) {
		
        const fields = [{ name: '/ping', value: `Shows API Latency`, inline: true },
            { name: '/server', value: `Shows Server Info`, inline: true },
            { name: '/help', value: `Shows Commands for Ryaz Bot`, inline: true },
            { name: '/addcoins', value: `Addes coins to user or\nuser having specific role`, inline: true },
            { name: '/createwallet', value: `Creates user and Coin wallet`, inline: true },
            { name: '/mycoins', value: `Shows Available Coins`, inline: true },
            { name: '/sendcoins', value: `Transfer your coins to other user`, inline: true },
            { name: '/showhistory', value: `Shows all coin transfer history`, inline: true },
            { name: '/introduce', value: `Registers user's introduction`, inline: true },
            { name: '/findintroduction', value: `Gives user's introduction`, inline: true }]
            const description = `Server name: ${interaction.guild.name}\n`
            return responseCommand(interaction, 'Help', fields, description, false);

	},
};