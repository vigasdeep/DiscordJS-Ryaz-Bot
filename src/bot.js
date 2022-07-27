require('dotenv').config();

const fs = require('fs');
const employee = require('./employee');
const { EmbedBuilder } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js') //importing discord.js
// Client interacts with discord API


//The GatewayIntentBits.Guilds intents option is necessary for your client to work properly.
//Since new updated of discord.js like version ^13.0 you have to specify client intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
    ],
}); // client(bot) is the instance of Client class
let info = [];
client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    // let data = fs.readFileSync('./src/employee.json').toString();
    // info.push(data);
    // console.log(info);
});



client.on('interactionCreate', async interaction => {

    const { commandName } = interaction;
    console.log(interaction);
    if (commandName === 'hello') {
        await interaction.reply('hey !');
    }
    else if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    } else if (commandName === 'user') {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    } else if (commandName === 'help') {
        await interaction.reply('This is a discord bot made for RYAZ');
    }
    else if (commandName === 'person') {

        const person = new employee();
        console.log(person);
        // await interaction.reply(person.name);
        person.name = interaction.user.tag;
        person.availableCoins = 0;
        person.id = interaction.user.id;
        // const Person = JSON.stringify(person);
        info.push(person);
        fs.writeFileSync('./src/employee.json', JSON.stringify(info), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x4ce4b1)
        .setTitle('My coins')
        .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
        .setDescription(`Created new User\nName: ${person.name} \nAvailable Coins: ${person.availableCoins}`)
        .setTimestamp()
        .setFooter({ text: 'Ryaz DiscordJS Bot' });

    interaction.reply({ embeds: [exampleEmbed] });
    }
    else if (commandName === 'addcoins') {
        let data = [];
        data = fs.readFileSync('./src/employee.json').toString()
        let newObject = JSON.parse(data);
        len = newObject.length
        for (let i = 0; i < len; i++) {

            if (interaction.user.id === newObject[i]['id']) {
                console.log("Im here");
                console.log(newObject[i]['name']);
                newObject[i]['availableCoins'] += 5;
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x4ce4b1)
                    .setTitle('My coins')
                    .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240'})
                    .setDescription(`Name: ${newObject[i]['name']}\nAdded 5 Coins\nAvailable Coins: ${newObject[i]['availableCoins']}`)
                    .setTimestamp()
                    .setFooter({ text: 'Ryaz DiscordJS Bot' });

                interaction.reply({ embeds: [exampleEmbed] });
                const updatedPerson = JSON.stringify(newObject);
                fs.writeFileSync('./src/employee.json', updatedPerson, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }

        }

    } else if (commandName === 'mycoins') {
        let data = [];
        data = fs.readFileSync('./src/employee.json').toString()
        let newObject = JSON.parse(data);
        len = newObject.length
        for (let i = 0; i < len; i++) {
            if (interaction.user.id === newObject[i]['id']) {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x4ce4b1)
                    .setTitle('My coins')
                    .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                    .setDescription(`Name: ${newObject[i]['name']}\nAvailable Coins: ${newObject[i]['availableCoins']}`)
                    .setTimestamp()
                    .setFooter({ text: 'Ryaz DiscordJS Bot' });

                interaction.reply({ embeds: [exampleEmbed] });

                const updatedPerson = JSON.stringify(newObject);
                fs.writeFileSync('./src/employee.json', updatedPerson, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);




