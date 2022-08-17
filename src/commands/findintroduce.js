const { findUserInfo } = require('../functions/mongoDbIntroduction');
const { SlashCommandBuilder } = require('discord.js');
const { embedCommand } = require('../functions/embed');


const commonRole = process.env.COMMON_ROLE_ID;



module.exports = {
    data: new SlashCommandBuilder().setName('findintroduction').setDescription(`Find user's introduction`)
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),

    async execute(interaction) {

        userId = interaction.user.id;
        member = interaction.guild.members.cache.get(userId)
        if (member.roles.cache.has(commonRole)) {
            const user = interaction.options.get('user').value;
            person = await findUserInfo(user);
            if (person === null) {
                const Title = `Find Information command`;
                const description = `The user does not have an introduction`;
                const introductionEmbed = embedCommand(interaction, Title, null, description);
                return interaction.reply({ embeds: [introductionEmbed], ephemeral: true });
            } else {
                const Title = `Find Information command`;
                const description = `**Name** : ${person.name}\n**Email**: ${person.email}\n**Introduction**: ${person.information}\n**Created on**: ${person.date}`;
                const introductionEmbed = embedCommand(interaction, Title, null, description);
                return interaction.reply({ embeds: [introductionEmbed], ephemeral: true });
            }
        } else {
            const Title = `Find Information command`;
            const description = `You don't have permission to use this command`;
            const introductionEmbed = embedCommand(interaction, Title, null, description);
            return interaction.reply({ embeds: [introductionEmbed], ephemeral: true });
        }


    },
};