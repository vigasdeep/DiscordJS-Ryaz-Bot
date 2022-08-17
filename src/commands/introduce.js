const { getDateAndTime, findUser } = require('../functions/mongoDbCoins');
const { introductionObject, findUserInfo, updateIntroData} = require('../functions/mongoDbIntroduction');
const { SlashCommandBuilder } = require('discord.js');
const { embedCommand } = require('../functions/embed');


module.exports = {
    data:new SlashCommandBuilder().setName('introduce').setDescription(`Introduce yourself to other member's of the server`)
	.addStringOption(option => option.setName('name').setDescription('Enter your name').setRequired(true))
	.addStringOption(option => option.setName('email').setDescription('Enter your email address').setRequired(true))
	.addStringOption(option => option.setName('introduction').setDescription('Enter your introduction here').setRequired(true)),
    
    async execute(interaction) {

        const user = findUserInfo(interaction.user.id);

        const name = interaction.options.get('name').value;
        const email = interaction.options.get('email').value;
        const introduction = interaction.options.get('introduction').value;
        const date = getDateAndTime();
        if(user !== null){
            updateIntroData(interaction.user.id,name,email,introduction,date)
        }else{
            const person = new introductionObject({
                name: name,
                discordid: interaction.user.id,
                email: email,
                information: introduction,
                date: getDateAndTime()
            })
            person.save()
        }
        
        const Title = `Introduction of ${name}`
        const description = `Email : ${email}`
        const fields = [
            { name: 'Introduction', value: `${introduction}`, inline: true },
        ]
        const introductionEmbed = embedCommand(interaction, Title, fields, description);

        return interaction.reply({ embeds: [introductionEmbed], ephemeral: false });
    }
           
};