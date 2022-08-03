require('dotenv').config();

const fs = require('fs');
const { PermissionToAddCoins, commonRole } = require('./config.json');
const employee = require('./employee');
const { responseCommand, embedCommand } = require('./embed');
const  createIntroduction  = require('./introduction')
const { EmbedBuilder, MessageCollector, Message } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
let info = [];
client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    fs.readFile('employee.json', function (err, data) {
        if (data.length == 0) {
            data = [{}]
            fs.writeFileSync('employee.json', data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        }
    })
    fs.readFile('introductionData.json', function (err, data) {
        if (data.length == 0) {
            data = [{}]
            fs.writeFileSync('introductionData.json', data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        }
    })
});

client.on('guildMemberAdd', member => {
    member.guild.channels.get('channelID').send("Welcome"); 
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
        case 'ping': {
            const fields = { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
            responseCommand(interaction, 'Ping', fields, null, false);
            break;
        }
        case 'server': {
            const fields = [{ name: 'Server Name', value: `${interaction.guild.name}`, inline: true }, { name: 'Total members', value: `${interaction.guild.memberCount}`, inline: true }]
            responseCommand(interaction, 'Server Information', fields, null, false);
            break;
        }
        case 'help': {
            const fields = [{ name: '/ping', value: `Shows API Latency`, inline: true },
            { name: '/server', value: `Shows Server Info`, inline: true },
            { name: '/help', value: `Shows Commands for Ryaz Bot`, inline: true },
            { name: '/addcoins', value: `Addes coins to user or\nuser having specific role`, inline: true },
            { name: '/createwallet', value: `Creates user and Coin wallet`, inline: true },
            { name: '/mycoins', value: `Shows Available Coins`, inline: true }]
            const description = `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
            responseCommand(interaction, 'Help', fields, description, false);
            break;
        }
        case 'createwallet': {
            let data = [];
            data = fs.readFileSync('employee.json').toString()
            let newObject = JSON.parse(data);
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
                person.availableCoins = 0;
                person.id = interaction.user.id;
                newObject.push(person);
                fs.writeFileSync('employee.json', JSON.stringify(newObject), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                const description = `Created new User !`
                const fields = [{ name: `Name: ${person.name}`, value: `Available Coins: ${person.availableCoins}`, inline: true }]
                // responseCommand(interaction,null,description,fields,true)
                const message = embedCommand('Create wallet command', fields, description);
                interaction.reply({ embeds: [message], ephemeral: true });
            } else {
                const fields = [{ name: `User Already Exists`, value: `Use /mycoins to see available coins`, inline: true }]
                // responseCommand(interaction,null,null,fields,false);
                const message = embedCommand('Create wallet command', fields, null);
                interaction.reply({ embeds: [message], ephemeral: true });
            }
            break;
        }
        case 'addcoins': {
            if (interaction.user.id != PermissionToAddCoins) {
                const description = `You don't have permission to use this command`
                const message = embedCommand('Add Coins Command', null, description);
                interaction.reply({ embeds: [message], ephemeral: true });
            }else if(interaction.options.get('role').id !== commonRole){
                const description = `You can't add coins to this role`
                const message = embedCommand('Add Coins Command', null, description);
                interaction.reply({ embeds: [message], ephemeral: true });
            }
            else {
                let info = [];
                info = fs.readFileSync('employee.json').toString()
                let newInfo = JSON.parse(info);
                len = newInfo.length
                let role = null;
                let user = null;
                amount = interaction.options.get('amount').value;
                if (amount <= 0) {
                    const description = `Amount must be positive`
                    const message = embedCommand('Add Coins Command', null, description);
                    interaction.reply({ embeds: [message], ephemeral: true });
                    return;
                }
                if (interaction.options.get('role') !== null) {
                    role = interaction.options.get('role').id;
                }
                if (interaction.options.get('user') !== null) {
                    console.log(interaction.options.get('user'))
                    user = interaction.options.get('user').value;
                }
                id = 0;
                if (user !== null) {
                    for (let i = 0; i < len; i++) {
                        if (newInfo[i]['id'] == user) {
                            newInfo[i]['availableCoins'] += amount;
                            const description = `Added ${amount} to ${newInfo[i]['name']} `
                            const updatedPerson = JSON.stringify(newInfo);
                            fs.writeFileSync('employee.json', updatedPerson, (err) => {
                                if (err) throw err;
                                console.log('The file has been saved!');
                            });

                            const message = embedCommand('Add Coins Command', null, description);
                            interaction.reply({ embeds: [message], ephemeral: true });
                        }
                    }
                } else if (role !== null) {
                    let coinAdded = [];
                    for (let x in newInfo) {
                        member = interaction.guild.members.cache.get(newInfo[x]['id'])
                        if (member.roles.cache.has(commonRole)) {
                            newInfo[x]['availableCoins'] += amount;
                            coinAdded.push({ name: `Added ${amount} to`, value: `${newInfo[x]['name']}`, inline: true })
                        }
                    }
                    const updatedPerson = JSON.stringify(newInfo);
                    fs.writeFileSync('employee.json', updatedPerson, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                    const message = embedCommand('Add Coins Command', coinAdded, null);
                    interaction.reply({ embeds: [message], ephemeral: true });
                }
            }

            break;
        }

        case 'mycoins': {
            let data = [];
            data = fs.readFileSync('employee.json').toString()
            let newObject = JSON.parse(data);
            len = newObject.length
            for (let i = 0; i < len; i++) {
                if (interaction.user.id === newObject[i]['id']) {
                    const title = 'My coins'
                    const fields = [{ name: `Name: ${newObject[i]['name']}`, value: `Available Coins: ${newObject[i]['availableCoins']}`, inline: true }]
                    responseCommand(interaction, title, fields, null, true);
                }
            }

            break;
        }
        case 'sendcoins': {
            myId = interaction.user.id;
            userId = interaction.options.get('user').value;
            amountToTransfer = interaction.options.get('amount').value;
            reason = interaction.options.get('reason').value;
            if (myId === userId) {
                const title = 'You cannot send coins to yourself'
                responseCommand(interaction, title, null, null, true);
                return;
            }
            if (amountToTransfer == 0) {
                const title = "Amount must be non-zero and positive"
                responseCommand(interaction, title, null, null, tre);
                return;
            } else if (amountToTransfer < 0) {
                const title = "Amount should be positive integer"
                responseCommand(interaction, title, null, null, true);
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
                    const title = "You don't have enough coins"
                    responseCommand(interaction, title, null, null, true);
                }
                else {
                    newObject[uindex]['availableCoins'] += amountToTransfer;
                    newObject[uindex]['recieveLog'].push(`Recieved ${amountToTransfer} coins from ${newObject[mindex]['name']}. Reason : ${reason}`);
                    newObject[mindex]['availableCoins'] -= amountToTransfer;
                    newObject[mindex]['sentLog'].push(`Transfered ${amountToTransfer} coins to ${newObject[uindex]['name']}. Reason : ${reason}`);
                    const updatedPerson = JSON.stringify(newObject);
                    fs.writeFileSync('employee.json', updatedPerson, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                    if (amountToTransfer == 1) {
                        senderid = newObject[mindex]['id']
                        recieverid = newObject[uindex]['id']
                        const description = `<@${senderid}> ` + `transfered **${amountToTransfer} coin** to ` + `<@${recieverid}>\n**Reason** : ${reason}`

                        responseCommand(interaction, 'Coin Transfered !', fields, description, false)
                        interaction.channel.send(`<@${PermissionToAddCoins}>`);
                    } else {
                        const title = 'Coins Transfered !'
                        senderid = newObject[mindex]['id']
                        recieverid = newObject[uindex]['id']
                        const description = `<@${senderid}> ` + `transfered **${amountToTransfer} coins** to ` + `<@${recieverid}>\n**Reason** : ${reason}`

                        responseCommand(interaction, title, null, description, false)
                        interaction.channel.send(`<@${PermissionToAddCoins}>`);
                    }


                }
            } else if (exist == 0) {
                responseCommand(interaction, null, null, "You do not have a wallet", false);
            } else if (userExist == 0) {
                responseCommand(interaction, null, null, "User does not have a wallet", false);
            } else {
                responseCommand(interaction, null, null, "Something went wrong", false)
            }
        }
            break;
        case 'showhistory':
            {
                let data = [];
                data = fs.readFileSync('employee.json').toString()
                let newObject = JSON.parse(data);
                len = newObject.length
                myId = interaction.user.id;
                for (let i = 0; i < len; i++) {
                    if (myId === newObject[i]['id']) {
                        exist = 1;
                        myindex = i;
                    }
                }
                if (exist === 1) {

                    SentInfo = newObject[myindex]['sentLog']
                    RecieveInfo = newObject[myindex]['recieveLog']
                    function showThis(arr) {
                        len = arr.length;
                        console.log(len)
                        if (len === 0) {
                            let char = 'none';
                            return char;
                        }
                        else {
                            return arr;
                        }

                    }
                    if (SentInfo.length <= 0 && RecieveInfo.length <= 0) {

                        const title = 'Coins Transfer History !';
                        const description = `${newObject[myindex]['name']}\nNo coins Transfered`;
                        const recieveTitle = 'Coins Recieve History !';
                        const recieveDesc = (`${newObject[myindex]['name']}\nNo coins recieved`);

                        const transfer = embedCommand(title, null, description);
                        const recieved = embedCommand(recieveTitle, null, recieveDesc);
                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true });

                    }
                    else if (SentInfo.length > 0 && RecieveInfo.length == 0) {

                        const transferTitle = 'Coins Transfer History !'
                        const transferDescription = `${newObject[myindex]['name']}\n${SentInfo.map(showThis).join('\n')}`

                        const recieveTitle = 'Coins Recieve History !'
                        const recieveDesc = `${newObject[myindex]['name']}\nNo coins recieved`

                        const transfer = embedCommand(transferTitle, null, transferDescription);
                        const recieved = embedCommand(recieveTitle, null, recieveDesc);

                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true });
                    }
                    else if (SentInfo.length == 0 && RecieveInfo.length > 0) {

                        const transferTitle = 'Coins Transfer History !'
                        const transferDescription = `${newObject[myindex]['name']}\nNo coins Transfered`

                        const recieveTitle = 'Coins Recieve History !'
                        const recieveDesc = `${newObject[myindex]['name']}\n${RecieveInfo.map(showThis).join('\n')}`
                        const transfer = embedCommand(transferTitle, null, transferDescription);
                        const recieved = embedCommand(recieveTitle, null, recieveDesc);

                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true });
                    }
                    else {
                        const transferTitle = 'Coins Transfer History !'
                        const transferDescription = `${newObject[myindex]['name']}\n${SentInfo.map(showThis).join('\n')}`

                        const recieveTitle = 'Coins Recieve History !'
                        const recieveDesc = `${newObject[myindex]['name']}\n${RecieveInfo.map(showThis).join('\n')}`

                        const transfer = embedCommand(transferTitle, null, transferDescription);
                        const recieved = embedCommand(recieveTitle, null, recieveDesc);
                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true });
                    }
                }
            }
            break;
       
    }
});

client.on('messageCreate',   msg =>{
    if(msg.content.toLocaleLowerCase() == "!introduce"){
        msg.reply('What is your name?');
        let name = 'string';
        let email = 'string';
        let introduction = 'string';
        let filter = (msg) => !msg.author.bot;
        let options = {
          max: 2,
          time: 500
        };
        let user = new createIntroduction();
        user.id = msg.author.id;
        counter = 0;
        
        let collector = msg.channel.createMessageCollector(filter, options);
        collector.on('collect', (m) => {
            if (counter == 1){
                name = m.content;
                msg.channel.send("What is your email?")
            }
            if (counter == 3){
                email = m.content;
                msg.channel.send("Tell us about yourself")
            }
            if (counter == 5){
                introduction = m.content;
                msg.channel.send("Thanks for introducing yourself to us")
                collector.stop();
            }
          counter+=1
        });
        collector.on('end', (collected) => {
          console.log(`Collected ${collected.size} items`);
          user.email = email;
        user.name = name;
        user.introduction = introduction;
        let data = [];
        data = fs.readFileSync('introductionData.json').toString()
        let newObject = JSON.parse(data);

        newObject.push(user);
        fs.writeFileSync('introductionData.json', JSON.stringify(newObject), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        });
        
    }
    
})

client.login(process.env.DISCORD_BOT_TOKEN);




