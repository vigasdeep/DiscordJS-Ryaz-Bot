const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./src/config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),

	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),

	new SlashCommandBuilder().setName('help').setDescription('Shows commands for bot'),

	new SlashCommandBuilder().setName('createwallet').setDescription('Creates wallet to store coins'),

	new SlashCommandBuilder().setName('addcoins').setDescription('Adds coins to user')
	.addIntegerOption(option => option.setName('amount').setDescription('Enter an integer').setRequired(true))
	.addUserOption(option => option.setName('user').setDescription('Enter a user').setRequired(false))
	.addMentionableOption(option => option.setName('role').setDescription('Enter a role').setRequired(false)),
	new SlashCommandBuilder().setName('mycoins').setDescription('Shows available coins'),

	new SlashCommandBuilder().setName('sendcoins').setDescription('Transfer your coins to other user')
	.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
	.addIntegerOption(option => option.setName('amount').setDescription('Enter an integer').setRequired(true))
	.addStringOption(option => option.setName('reason').setDescription('Enter your reason here').setRequired(true)),
	
	new SlashCommandBuilder().setName('showhistory').setDescription('Shows coin transfer history'),

	new SlashCommandBuilder().setName('introduce').setDescription('Introduce yourself to Ryaz')
	// .addStringOption(option => option.setName('name').setDescription('Enter your name').setRequired(true))
	// .addStringOption(option => option.setName('email').setDescription('Enter your email address').setRequired(true))
	// .addStringOption(option => option.setName('introduction').setDescription('Introduce yourself').setRequired(true)),
		
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// 	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// // for global commands
// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);