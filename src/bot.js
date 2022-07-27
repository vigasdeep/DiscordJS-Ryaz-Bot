require('dotenv').config();

const fs = require('fs');
const employee = require('./employee');
const { EmbedBuilder } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});
let info = [];
client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`);

});

client.on('interactionCreate', async interaction => {

    const { commandName } = interaction;
    console.log(interaction);
    if (commandName === 'ping') {
        // await interaction.reply(`API Latency is ${Math.round(client.ws.ping)}ms`);

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x4ce4b1)
            .setTitle('Ping')
            .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
            .addFields(
                { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Ryaz DiscordJS Bot' });

        interaction.reply({ embeds: [exampleEmbed] });

    } else if (commandName === 'server') {

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x4ce4b1)
            .setTitle('Server Info')
            .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
            .addFields(
                { name: 'Total members', value: `${interaction.guild.memberCount}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Ryaz DiscordJS Bot' });

        interaction.reply({ embeds: [exampleEmbed] });

    } else if (commandName === 'user') {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);

    } else if (commandName === 'help') {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x4ce4b1)
            .setTitle('Help')
            .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
            // .setDescription(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`)
            .addFields(
                { name: '/ping', value: `Shows API Latency`, inline: true },
                { name: '/server', value: `Shows Server Info`, inline: true },
                { name: '/help', value: `Shows Commands for Ryaz Bot`, inline: true },
                { name: '/person', value: `Creates user and Coin wallet`, inline: true },
                { name: '/addcoin', value: `Adds 5 coins to user`, inline: true },
                { name: '/mycoins', value: `Shows Available Coins`, inline: true },
                { name: '/sendCoins', value: `Transfer your coins to other user`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Ryaz DiscordJS Bot' });

        interaction.reply({ embeds: [exampleEmbed] });


        await interaction.reply('This is a discord bot made for RYAZ');
    }
    else if (commandName === 'person') {
        let data = [];
        data = fs.readFileSync('employee.json').toString()
        console.log(data);
        let newObject = JSON.parse(data);
        console.log(newObject);
        len = newObject.length
        let exist = 0;
        for (let i = 0; i < len; i++) {

            if (interaction.user.id === newObject[i]['id']) {
                exist = 1;
            }

        }
        if (exist === 0) {
            const person = new employee();
            person.name = interaction.user.tag;
            person.availableCoins = 10;
            person.id = interaction.user.id;

            info.push(person);
            fs.writeFileSync('employee.json', JSON.stringify(info), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x4ce4b1)

                .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                .setDescription(`Created new User !`)
                .addFields(
                    { name: `Name: ${person.name}`, value: `Available Coins:${person.availableCoins}`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'Ryaz DiscordJS Bot' });

            interaction.reply({ embeds: [exampleEmbed] });
        } else {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0xFF0000)

                .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                .addFields(
                    { name: `User Already Exists`, value: `Use /mycoins to see available coins`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'Ryaz DiscordJS Bot' });

            interaction.reply({ embeds: [exampleEmbed] });
        }

    }

    else if (commandName === 'addcoins') {
        let data = [];
        data = fs.readFileSync('employee.json').toString()
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
                    .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                    .setDescription(`Added 5 Coins`)
                    .addFields(
                        { name: `Name: ${newObject[i]['name']}`, value: `Available Coins: ${newObject[i]['availableCoins']}`, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Ryaz DiscordJS Bot' });

                interaction.reply({ embeds: [exampleEmbed] });
                const updatedPerson = JSON.stringify(newObject);
                fs.writeFileSync('employee.json', updatedPerson, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }

        }

    } else if (commandName === 'mycoins') {
        let data = [];
        data = fs.readFileSync('employee.json').toString()
        let newObject = JSON.parse(data);
        len = newObject.length
        for (let i = 0; i < len; i++) {
            if (interaction.user.id === newObject[i]['id']) {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x4ce4b1)
                    .setTitle('My coins')
                    .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                    .addFields(
                        { name: `Name: ${newObject[i]['name']}`, value: `Available Coins: ${newObject[i]['availableCoins']}`, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Ryaz DiscordJS Bot' });

                interaction.reply({ embeds: [exampleEmbed] });

                const updatedPerson = JSON.stringify(newObject);
                fs.writeFileSync('employee.json', updatedPerson, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
        }
    } else if (commandName === 'sendcoins') {
        console.log(interaction.options.get('target').value);
        console.log(interaction.options.get('int').value);
        myId = interaction.user.id;
        userId = interaction.options.get('target').value;
        amountToTransfer = interaction.options.get('int').value;
        if (amountToTransfer == 0) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                .setTitle("Amount must be non-zero and positive")
                .setTimestamp()
                .setFooter({ text: 'Ryaz DiscordJS Bot' });

            interaction.reply({ embeds: [exampleEmbed] });
            return;
        } else if (amountToTransfer < 0) {
           
            const exampleEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                .setTitle("Amount should be positive integer")
                .setTimestamp()
                .setFooter({ text: 'Ryaz DiscordJS Bot' });

            interaction.reply({ embeds: [exampleEmbed] });
            return;
        }
        let data = [];
        data = fs.readFileSync('employee.json').toString()
        let newObject = JSON.parse(data);
        len = newObject.length
        let mindex = 0;

        let exist = 0;
        userExist = 0;
        for (let i = 0; i < len; i++) {

            if (myId === newObject[i]['id']) {
                exist = 1;
                mindex = i;
            }

        }
        for (let i = 0; i < len; i++) {

            if (userId === newObject[i]['id']) {
                userExist = 1;
                uindex = i;
            }

        }
        if (exist === 1 && userExist === 1) {
            
            if (newObject[mindex]['availableCoins'] < amountToTransfer) {
                interaction.reply("You don't have enough coins");

            }
            else {
                newObject[uindex]['availableCoins'] += amountToTransfer;
                newObject[mindex]['availableCoins'] -= amountToTransfer;
                // interaction.reply(`coins transfered!\n${newObject[uindex]['name']} now has ${newObject[uindex]['availableCoins']}`)

                const updatedPerson = JSON.stringify(newObject);
                fs.writeFileSync('employee.json', updatedPerson, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                if (amountToTransfer == 1) {
                    const exampleEmbed = new EmbedBuilder()
                        .setColor(0x4ce4b1)
                        .setTitle('Coins Transfered !')
                        .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                        .setDescription(`${newObject[mindex]['name']}`)
                        .addFields(
                            { name: `Transfered ${amountToTransfer} coin to ${newObject[uindex]['name']}`, value: `Your available coins : ${newObject[mindex]['availableCoins']}`, inline: true },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Ryaz DiscordJS Bot' });
                        interaction.reply({ embeds: [exampleEmbed] });
                } else {
                    const exampleEmbed = new EmbedBuilder()
                        .setColor(0x4ce4b1)
                        .setTitle('Coins Transfered !')
                        .setAuthor({ name: 'Ryaz DiscordJS Bot', iconURL: 'https://cdn.discordapp.com/icons/567953549791723530/49214a6caeae3b19376dc94ced5bbbfc.webp?size=240' })
                        .setDescription(`${newObject[mindex]['name']}`)
                        .addFields(
                            { name: `Transfered ${amountToTransfer} coins to ${newObject[uindex]['name']}`, value: `Your available coins : ${newObject[mindex]['availableCoins']}`, inline: true },
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Ryaz DiscordJS Bot' });
                        interaction.reply({ embeds: [exampleEmbed] });

                }

                
            }
        } else if (exist == 0) {
            interaction.reply("You do not have a wallet");
        } else if (userExist == 0) {
            interaction.reply("User does not have a wallet");
        } else {
            interaction.reply("Something went wrong");
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);




