const { SlashCommandBuilder } = require('discord.js');

const {embedCommand } = require('../functions/embed');
const {findUser} = require('../functions/mongoDbCoins');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('showhistory')
        .setDescription('Shows coin transfer history'),

    async execute(interaction) {
        user = await findUser(interaction.user.id);
        if (user !== 0) {
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
            if (AddInfo.length <= 0) {
                const AddTitle = 'Coin Add History !'
                const AddDesc = `${user.name}\nNo coins recieved`
                const added = embedCommand(interaction, AddTitle, null, AddDesc);
                EmbedARRAY.push(added)
            } else {
                const AddTitle = 'Coin Add History !'
                const AddDesc = `${user.name}\n${AddInfo.map(showThis).join('\n')}`
                const added = embedCommand(interaction, AddTitle, null, AddDesc);
                EmbedARRAY.push(added)
            }
            if (SentInfo.length <= 0) {
                const title = 'Coins Transfer History !';
                const description = `${user.name}\nNo coins Transfered`;
                const transfer = embedCommand(interaction, title, null, description);
                EmbedARRAY.push(transfer);
            } else {
                const title = 'Coins Transfer History !';
                const description = `${user.name}\n${SentInfo.map(showThis).join('\n')}`
                const transfer = embedCommand(interaction, title, null, description);
                EmbedARRAY.push(transfer);
            }
            if (RecieveInfo.length <= 0) {

                const recieveTitle = 'Coins Recieve History !';
                const recieveDesc = `${user.name}\nNo coins recieved`;

                const recieved = embedCommand(interaction, recieveTitle, null, recieveDesc);
                EmbedARRAY.push(recieved);
            }
            else {
                const recieveTitle = 'Coins Recieve History !'
                const recieveDesc = `${user.name}\n${RecieveInfo.map(showThis).join('\n')}`
                const recieved = embedCommand(interaction, recieveTitle, null, recieveDesc);
                EmbedARRAY.push(recieved)
            }

            return interaction.reply({ embeds: EmbedARRAY, ephemeral: true });


        }
    },
};


