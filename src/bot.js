require('dotenv').config();

const fs = require('fs');
const { PermissionToAddCoins, commonRole, welcomeChannelId} = require('./config.json');

const { responseCommand, embedCommand } = require('./embed');
const { Client, GatewayIntentBits } = require('discord.js');
const { connectToDb, EmployeeData,findUser, addCoins, addCoinsToAll, getCoins,transferCoins } = require('./mongoDbCoins');
const { introductionObject } = require('./mongoDbIntroduction');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['MESSAGE']
});

client.once('ready', () => {
    connectToDb();
    console.log(`${client.user.tag} has logged in.`);
    client.user.setPresence({
        game: { name: '/help' },
        status: 'online',
       });
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
            
            userId = interaction.user.id;
            data = await findUser(userId)
            member = interaction.guild.members.cache.get(userId)
            if(member.roles.cache.has(commonRole)){
                if(data!==null){
                    const fields = [{ name: `User Already Exists`, value: `Use /mycoins to see available coins`, inline: true }]
                    
                    const message = embedCommand('Create wallet command', fields, null);
                    interaction.reply({ embeds: [message], ephemeral: true });
                }else{
                    const employee = new EmployeeData({
                        name : interaction.user.username,
                        recieveCoins: true,
                        coins : 0,
                        discordid: interaction.user.id,
                        sentLogs : [],
                        recieveLogs : [],
                        addcoinsLogs :[],
                    })
                    employee.save();
                    const description = `Created new User !`
                    const fields = [{ name: `Name: ${employee.name}`, value: `Available Coins: ${employee.coins}`, inline: true }]
                    // responseCommand(interaction,null,description,fields,true)
                    const message = embedCommand('Create wallet command', fields, description);
                    interaction.reply({ embeds: [message], ephemeral: true });
                }
            }else{
                const description = `You don't have permission to use this command`
                const message = embedCommand('Create wallet command', null, description);
                interaction.reply({ embeds: [message], ephemeral: true });
            }
            
            break;
        }
        case 'addcoins': {
            if (interaction.user.id != PermissionToAddCoins) {
                const description = `You don't have permission to use this command`
                const message = embedCommand('Add Coins Command', null, description);
                interaction.reply({ embeds: [message], ephemeral: true });
            }
            else {
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
                    role = interaction.options.get('role').value;
                }
                if (interaction.options.get('user') !== null) {
                    console.log(interaction.options.get('user'))
                    user = interaction.options.get('user').value;
                }
                if (user !== null) {
                    const person = await findUser(user);
                    if (person !== null){
                        await addCoins(user,amount);
                        const description = `Added ${amount} to ${person.name}`
                        const message = embedCommand('Add Coins Command', null, description);
                        interaction.reply({ embeds: [message], ephemeral: true });
                    }else{
                        const description = `User Doesn't have a wallet.`
                        const message = embedCommand('Add Coins Command', null, description);
                        interaction.reply({ embeds: [message], ephemeral: true });
                    }
                }
                 else if (role !== null) {
                    if(role !== commonRole){
                        const description = `You can't add coins to this role`
                        const message = embedCommand('Add Coins Command', null, description);
                        interaction.reply({ embeds: [message], ephemeral: true });
                    }else{
                    await addCoinsToAll(amount);
                    const message = embedCommand('Add Coins Command', null, `${amount} added to every user !`);
                    interaction.reply({ embeds: [message], ephemeral: true });
                    }
                }
            }
            break;
        }

        case 'mycoins': {
            id = interaction.user.id;
            coins = await getCoins(id);
            const title = 'My coins'
            const fields = [{ name: `Name: ${interaction.user.username}`, value: `Available Coins: ${coins}`, inline: true }]
            responseCommand(interaction, title, fields, null, true);
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
                responseCommand(interaction, title, null, null, true);
                return;
            } else if (amountToTransfer < 0) {
                const title = "Amount should be positive integer"
                responseCommand(interaction, title, null, null, true);
                return;
            }
            sender = await findUser(myId);
            reciever = await findUser(userId);
            if (sender !== null  && reciever !== null ) {
                if (sender.coins < amountToTransfer) {
                    const title = "You don't have enough coins"
                    responseCommand(interaction, title, null, null, true);
                }
                else {
                    transferCoins(myId,userId,amountToTransfer,sender.name,reciever.name,reason)
                    if (amountToTransfer == 1) {
                        const description = `<@${myId}> ` + `transfered **${amountToTransfer} coin** to ` + `<@${userId}>\n**Reason** : ${reason}`
                        responseCommand(interaction, 'Coin Transfered !', fields, description, false)
                        interaction.channel.send(`<@${PermissionToAddCoins}>`);
                    } else {
                        const title = 'Coins Transfered !'
                        const description = `<@${myId}> ` + `transfered **${amountToTransfer} coins** to ` + `<@${userId}>\n**Reason** : ${reason}`
                        responseCommand(interaction, title, null, description, false)
                        interaction.channel.send(`<@${PermissionToAddCoins}>`);
                    }

                }
            } else if (sender== null) {
                responseCommand(interaction, null, null, "You do not have a wallet", false);
            } else if (reciever == null) {
                responseCommand(interaction, null, null, "User does not have a wallet", false);
            } else {
                responseCommand(interaction, null, null, "Something went wrong", false)
            }
        }
            break;
        case 'showhistory':
            {
                user = await findUser(interaction.user.id);
                if (user!== 0) {

                    SentInfo = user.sentLogs;
                    RecieveInfo = user.recieveLogs;
                    AddInfo = user.addcoinsLogs;
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
                    EmbedARRAY = []
                    if (AddInfo.length <= 0){
                        const AddTitle = 'Coin Add History !'
                        const AddDesc = `${user.name}\nNo coins recieved`
                        const added = embedCommand(AddTitle, null, AddDesc);
                        EmbedARRAY.push(added)
                    }else{
                        const AddTitle = 'Coin Add History !'
                        const AddDesc = `${user.name}\n${AddInfo.map(showThis).join('\n')}`
                        const added = embedCommand(AddTitle, null, AddDesc);
                        EmbedARRAY.push(added)
                    }
                    if (SentInfo.length <= 0) {
                        const title = 'Coins Transfer History !';
                        const description = `${user.name}\nNo coins Transfered`;
                        const transfer = embedCommand(title, null, description);
                        EmbedARRAY.push(transfer);
                    }else {
                        const title = 'Coins Transfer History !';
                        const description = `${user.name}\n${SentInfo.map(showThis).join('\n')}`
                        const transfer = embedCommand(title, null, description);
                        EmbedARRAY.push(transfer);
                    }
                     if (RecieveInfo.length <= 0) {

                        const recieveTitle = 'Coins Recieve History !';
                        const recieveDesc = `${user.name}\nNo coins recieved`;

                        const recieved = embedCommand(recieveTitle, null, recieveDesc);
                        EmbedARRAY.push(recieved);
                    }
                    else  {
                        const recieveTitle = 'Coins Recieve History !'
                        const recieveDesc = `${user.name}\n${RecieveInfo.map(showThis).join('\n')}`
                        const recieved = embedCommand(recieveTitle, null, recieveDesc);
                        EmbedARRAY.push(recieved)
                    }
                    
                    interaction.reply({ embeds: EmbedARRAY, ephemeral: true });
                     
                    
                }
            }
            break;
       
    }
});

client.on('messageCreate',   msg =>{
    if(msg.author.bot) return;
    let isWelcomeMessage = msg.type === 7

    if (isWelcomeMessage){
        const Title = `Welcome ${msg.author.username}`
        const description = `Please type !introduce to give your introduction`
        const introductionEmbed = embedCommand(Title, null, description);
        client.channels.cache.get(welcomeChannelId).send({ embeds: [introductionEmbed], ephemeral: true })
    }
   
    if(msg.content.toLocaleLowerCase().startsWith ("!introduce")){
        msg.channel.send('What is your name?');
        let name = 'string';
        let email = 'string';
        let introduction = 'string';
        const userID = msg.author.id
        let filter = (m) => {!msg.author.bot, msg.author.id === userID} ;
        let options = {
          max: 2,
          time: 500
        };
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
                collector.stop();
            }
          counter+=1
        });
        collector.on('end', (collected) => {
          console.log(`Collected ${collected.size} items`);
          const person = new introductionObject({
            name : name,
            discordid: msg.author.id,
            email : email,
            information : introduction
        })
        person.save()
        msg.channel.bulkDelete(6);
        const Title = `Introduction of ${msg.author.username}`
        const description = `Email : ${email}`
        const fields =[
            { name: 'Introduction', value: `${introduction}`, inline: true },
        ]
        const introductionEmbed = embedCommand(Title, fields, description);
       
        msg.channel.send({ embeds: [introductionEmbed], ephemeral: true });
        });
        
    }
    
})




client.login(process.env.DISCORD_BOT_TOKEN);




