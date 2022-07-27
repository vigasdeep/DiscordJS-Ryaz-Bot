require('dotenv').config();

//console.log(process.env.DISCORD_BOT_TOKEN);

const { Client,  GatewayIntentBits } = require('discord.js') //importing discord.js
// Client interacts with discord API


//The GatewayIntentBits.Guilds intents option is necessary for your client to work properly.
//Since new updated of discord.js like version ^13.0 you have to specify client intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
    ],
} ); // client(bot) is the instance of Client class

client.once('ready', () => {
	console.log(`${client.user.tag} has logged in.`);
});


client.on('interactionCreate', async interaction => {
	    
	const { commandName } = interaction;
    console.log(interaction);
    if (commandName === 'hello'){
        await interaction.reply('hey !');
    }
	else if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	} else if (commandName === 'help'){
        await interaction.reply('This is a discord bot made for RYAZ');
    } else if (commandName === 'person'){
        await interaction.reply('Let');
    }
});

// client.on('messageCreate', (message)  =>{
//     console.log(message.content);
// })




client.login(process.env.DISCORD_BOT_TOKEN);






