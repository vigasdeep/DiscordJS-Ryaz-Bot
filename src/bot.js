require('dotenv').config();

const fs = require('fs')
const employee = require('./employee')
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

// let array = [];

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
    } 
    else if (commandName === 'person'){
        const person = new employee();
        // await interaction.reply(person.name);
        person.name = interaction.user.tag;
        person.availableCoins = 0;
        // array.push(person);
        const Person = JSON.stringify(person);
        fs.writeFile('./src/employee.json',Person,(err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
        await interaction.reply(`Person Created. Name: ${person.name} and Available Coins : ${person.availableCoins}`);
    }
    else if (commandName === 'addcoins'){
        // let info = [];
        let data = fs.readFileSync('./src/employee.json').toString()
        console.log("DATA FROM FILE ", data);
        // info.push(data.toString());
        let newObject = JSON.parse(data);
        let Person = new employee();
        Person.updateInfo(newObject['name'],newObject['availableCoins']);
        console.log("THIS IS NEW DATA: ",Person);
       
        Person.availableCoins+=5;
        await interaction.reply(`5 Coins added to ${Person.name} \n Now Available Coins : ${Person.availableCoins}`);
        const updatedPerson = JSON.stringify(Person);
        fs.writeFile('./src/employee.json',updatedPerson,(err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);






