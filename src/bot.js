require('dotenv').config();

const fs = require('fs');
const employee = require('./employee');
const {responseCommand,embedCommand} = require('./embed');
const {createIntroduction} = require('./introduction')
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
            { name: '/createwallet', value: `Creates user and Coin wallet`, inline: true },
            { name: '/addcoin', value: `Adds 5 coins to user`, inline: true },
            { name: '/mycoins', value: `Shows Available Coins`, inline: true },
            { name: '/sendCoins', value: `Transfer your coins to other user`, inline: true }]
            const description = `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
            responseCommand(interaction, 'Help', fields, description, false);
            break;
        }
        case 'createwallet': {
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
                const description = `Created new User !`
                const fields = [{ name: `Name: ${person.name}`, value: `Available Coins:${person.availableCoins}`, inline: true}]
                responseCommand(interaction,null,description,fields,false)
            } else {  
                const fields =  [{ name: `User Already Exists`, value: `Use /mycoins to see available coins`, inline: true }]
                responseCommand(interaction,null,null,fields,false);
            }
            break;
        }
        case 'addcoins':{
        let info = [];
        info = fs.readFileSync('employee.json').toString()
        let newInfo = JSON.parse(info);
        len = newInfo.length
        for (let i = 0; i < len; i++) {

            if (interaction.user.id === newInfo[i]['id']) {
                console.log(newInfo[i]['name']);
                newInfo[i]['availableCoins'] += 5;
                
                 const description = `Added 5 Coins`
                 const fields =[{ name: `Name: ${newInfo[i]['name']}`, value: `Available Coins: ${newInfo[i]['availableCoins']}`, inline: true }]
                        
                responseCommand(interaction,`Add coins`, fields,description,true)
                    
                const updatedPerson = JSON.stringify(newInfo);
                    fs.writeFileSync('employee.json', updatedPerson, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
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
                responseCommand(interaction,title,fields,null,true);
                }
            }
        
            break;}
        case 'sendcoins': {
            myId = interaction.user.id;
            userId = interaction.options.get('user').value;
            amountToTransfer = interaction.options.get('int').value;
            if (amountToTransfer == 0) {
                const title = "Amount must be non-zero and positive" 
                responseCommand(interaction,title,null,null,false);
                return;
            } else if (amountToTransfer < 0) {
            const title = "Amount should be positive integer"
            responseCommand(interaction,title,null,null,false);
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
             responseCommand(interaction,title,null,null,true);
                }
                else {
                    newObject[uindex]['availableCoins'] += amountToTransfer;
                    newObject[uindex]['recieveLog'].push(`Recieved ${amountToTransfer} coins from ${newObject[mindex]['name']}`);
                    newObject[mindex]['availableCoins'] -= amountToTransfer;
                    newObject[mindex]['sentLog'].push(`Transfered ${amountToTransfer} coins to ${newObject[uindex]['name']}`);
                    const updatedPerson = JSON.stringify(newObject);
                    fs.writeFileSync('employee.json', updatedPerson, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                    if (amountToTransfer == 1) {
                        const description = `${newObject[mindex]['name']}`
                        const fields = [{ name: `Transfered ${amountToTransfer} coin to ${newObject[uindex]['name']}`, value: `Your available coins : ${newObject[mindex]['availableCoins']}`, inline: true }]
                       responseCommand(interaction,'Coin Transfered !',fields,description,false)
                    } else {
                            const title = 'Coins Transfered !'
                            const description = `${newObject[mindex]['name']}`
                            const fields = [{ name: `Transfered ${amountToTransfer} coins to ${newObject[uindex]['name']}`, value: `Your available coins : ${newObject[mindex]['availableCoins']}`, inline: true }]
                            responseCommand(interaction,title,fields,description,false)
                    }


                }
            } else if (exist == 0) {
                responseCommand(interaction,null,null,"You do not have a wallet",false);
            } else if (userExist == 0) {
                responseCommand(interaction,null,null,"User does not have a wallet",false);
            } else {
                responseCommand(interaction,null,null,"Something went wrong",false)
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
                        const description =`${newObject[myindex]['name']}\nNo coins Transfered`;
                        const recieveTitle = 'Coins Recieve History !';
                        const recieveDesc = (`${newObject[myindex]['name']}\nNo coins recieved`);

                        const transfer = embedCommand(title,null,description);
                        const recieved = embedCommand(recieveTitle,null,recieveDesc);
                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true});

                    }
                    else if (SentInfo.length > 0 && RecieveInfo.length == 0) {
                        
                        const transferTitle = 'Coins Transfer History !'
                        const transferDescription =`${newObject[myindex]['name']}\n${SentInfo.map(showThis).join('\n')}`
                        
                        const recieveTitle = 'Coins Recieve History !'
                        const recieveDesc = `${newObject[myindex]['name']}\nNo coins recieved`
                        
                        const transfer = embedCommand(transferTitle,null,transferDescription);
                        const recieved = embedCommand(recieveTitle,null,recieveDesc);

                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true});
                    }
                    else if (SentInfo.length == 0 && RecieveInfo.length > 0) {
                    
                        const transferTitle = 'Coins Transfer History !'
                        const transferDescription =`${newObject[myindex]['name']}\nNo coins Transfered`
                       
                        const recieveTitle ='Coins Recieve History !'
                        const recieveDesc = `${newObject[myindex]['name']}\n${RecieveInfo.map(showThis).join('\n')}`
                        const transfer = embedCommand(transferTitle,null,transferDescription);
                        const recieved = embedCommand(recieveTitle,null,recieveDesc);

                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true});
                    }
                    else {
                        const transferTitle = 'Coins Transfer History !'
                        const transferDescription = `${newObject[myindex]['name']}\n${SentInfo.map(showThis).join('\n')}`
                        
                        const recieveTitle = 'Coins Recieve History !'
                        const recieveDesc =`${newObject[myindex]['name']}\n${RecieveInfo.map(showThis).join('\n')}`
                        
                        const transfer = embedCommand(transferTitle,null,transferDescription);
                        const recieved = embedCommand(recieveTitle,null,recieveDesc);
                        interaction.reply({ embeds: [transfer, recieved], ephemeral: true});
                    }
                }
            }
            break;
    case 'introduce':
            {
                const userInfo = new createIntroduction;
                userInfo.id = interaction.user.id;
                userInfo.name = interaction.options.get('name').value;
                userInfo.email = interaction.options.get('email');
                userInfo.phonenumber = interaction.options.get('phonenumber').value;
                userInfo.introduction = interaction.options.get('introduction').value;
                let data = [];
                data.push(userInfo);
                fs.writeFileSync('introducitonData.json', JSON.stringify(data), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                console.log(data);
                const title = `${user.name}`;
                const description = `${user.introduction}`;
                responseCommand(interaction,title,null,description,false);
            }
            break;
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);




