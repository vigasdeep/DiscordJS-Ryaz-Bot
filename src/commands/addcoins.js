const {  findUser, addCoins, addCoinsToAll} = require('../functions/mongoDbCoins');
const { SlashCommandBuilder } = require('discord.js');
const { embedCommand } = require('../functions/embed');

const PermissionToAddCoins = process.env.USER_ID_WHO_CAN_ADD_COINS;
const commonRole = process.env.COMMON_ROLE_ID;

module.exports = {
	data: new SlashCommandBuilder()
    .setName('addcoins')
    .setDescription('Adds coins to user')
	.addIntegerOption(option => option.setName('amount').setDescription('Enter an integer').setRequired(true))
	.addUserOption(option => option.setName('user').setDescription('Enter a user').setRequired(false))
	.addMentionableOption(option => option.setName('role').setDescription('Enter a role').setRequired(false)),
	
    async execute(interaction) {
        
        if (interaction.user.id != PermissionToAddCoins) {
            const description = `You don't have permission to use this command`
            const message = embedCommand(interaction,'Add Coins Command', null, description);
            return interaction.reply({ embeds: [message], ephemeral: true });
        }
        else {
            let role = null;
            let user = null;
            amount = interaction.options.get('amount').value;
            if (amount <= 0) {
                const description = `Amount must be positive`
                const message = embedCommand(interaction,'Add Coins Command', null, description);
                return interaction.reply({ embeds: [message], ephemeral: true });
                
            }
            if (interaction.options.get('role') !== null) {
                role = interaction.options.get('role').value;
            }
            if (interaction.options.get('user') !== null) {
                console.log(interaction.options.get('user'))
                user = interaction.options.get('user').value;
            }
            if (user !== null && role !== null){
                const description = `Please select only one option.`
                const message = embedCommand(interaction,'Add Coins Command', null, description);
                return interaction.reply({ embeds: [message], ephemeral: true });
            }
            else if (user !== null) {
                const person = await findUser(user);
                if (person !== null) {
                    await addCoins(user, amount);
                    const description = `Added ${amount} to ${person.name}`
                    const message = embedCommand(interaction,'Add Coins Command', null, description);
                    return interaction.reply({ embeds: [message], ephemeral: true });
                } else {
                    const description = `User Doesn't have a wallet.`
                    const message = embedCommand(interaction,'Add Coins Command', null, description);
                    return interaction.reply({ embeds: [message], ephemeral: true });
                }
            }
            else if (role !== null) {
                if (role !== commonRole) {
                    const description = `You can't add coins to this role`
                    const message = embedCommand(interaction,'Add Coins Command', null, description);
                    return interaction.reply({ embeds: [message], ephemeral: true });
                } else {
                    data = await addCoinsToAll(amount);
                    if (data.length === 0) {
                        const message = embedCommand(interaction,'Add Coins Command', null, `No data in database`);
                        return interaction.reply({ embeds: [message], ephemeral: true });
                    } else {
                        fields = [];
                        for (let x in data) {
                            fields.push({ name: `Added ${amount} coins to`, value: data[x]['name'] });
                        }
                        const message = embedCommand(interaction,'Add Coins Command', fields, null);
                        return interaction.reply({ embeds: [message], ephemeral: true });
                    }

                }
            }
        }

	},
};