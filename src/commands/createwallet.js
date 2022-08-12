const {  EmployeeData, findUser } = require('../functions/mongoDbCoins');
const { SlashCommandBuilder } = require('discord.js');
const { embedCommand } = require('../functions/embed');

const commonRole = process.env.COMMON_ROLE_ID;



module.exports = {
	data: new SlashCommandBuilder()
    .setName('createwallet')
    .setDescription('Creates wallet to store coins'),

	async execute(interaction) {
        
        userId = interaction.user.id;
            data = await findUser(userId)
            member = interaction.guild.members.cache.get(userId)
            if (member.roles.cache.has(commonRole)) {
                if (data !== null) {
                    const fields = [{ name: `User Already Exists`, value: `Use /mycoins to see available coins`, inline: true }]

                    const message = embedCommand(interaction,'Create wallet command', fields, null);
                    return interaction.reply({ embeds: [message], ephemeral: true });
                } else {
                    const employee = new EmployeeData({
                        name: interaction.user.username,
                        recieveCoins: true,
                        coins: 0,
                        discordid: interaction.user.id,
                        sentLogs: [],
                        recieveLogs: [],
                        addcoinsLogs: [],
                    })
                    employee.save();
                    const description = `Created new wallet !`
                    const fields = [{ name: `Name: ${employee.name}`, value: `Available Coins: ${employee.coins}`, inline: true }]
                   
                    const message = embedCommand(interaction,'Create wallet command', fields, description);
                    return interaction.reply({ embeds: [message], ephemeral: true });
                }
            } else {
                const description = `You don't have permission to use this command`
                const message = embedCommand(interaction,'Create wallet command', null, description);
                return interaction.reply({ embeds: [message], ephemeral: true });
            }


	},
};