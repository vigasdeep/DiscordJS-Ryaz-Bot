const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('help').setDescription('Shows commands for bot'),
	new SlashCommandBuilder().setName('person').setDescription('creates new person (testing)'),
	new SlashCommandBuilder().setName('addcoins').setDescription('Adds coins to user'),
	new SlashCommandBuilder().setName('mycoins').setDescription('Shows available coins'),
	new SlashCommandBuilder().setName('sendcoins').setDescription('Transfer your coins to other user')
	.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))
	.addIntegerOption(option => option.setName('int').setDescription('Enter an integer').setRequired(true)),
	new SlashCommandBuilder().setName('newperson').setDescription('New command to save user in JSON(testing)'),
	new SlashCommandBuilder().setName('newsendcoins').setDescription('New command to send coins to user and add logs in JSON(testing)')
	.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
	.addIntegerOption(option => option.setName('coins').setDescription('Enter an integer').setRequired(true)),	
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