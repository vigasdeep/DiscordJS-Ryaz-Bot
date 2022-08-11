require('dotenv').config();
const fs = require('fs');
const path = require('node:path');
const {  embedCommand } = require('./src/functions/embed');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { connectToDb, getDateAndTime } = require('./src/functions/mongoDbCoins');
const { introductionObject,} = require('./src/functions/mongoDbIntroduction');

const client = new Client({
    intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.DirectMessages],
    partials: ['MESSAGE']
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, '/src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    connectToDb();
    console.log(`${client.user.tag} has logged in.`);
});

const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction,client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    let isWelcomeMessage = msg.type === 7

    if (isWelcomeMessage) {
        const Title = `Welcome ${msg.author.username}`
        const description = `Please type !introduce to give your introduction`
        const introductionEmbed = embedCommand(client,Title, null, description);
        client.channels.cache.get(welcomeChannelId).send({ embeds: [introductionEmbed], ephemeral: true })
        client.channels.cache.get(welcomeChannelId).send(`<@${msg.author.id}>`);
    }

    if (msg.content.toLocaleLowerCase().startsWith("!introduce")) {
        msg.channel.send('What is your name?');
        let name = 'string';
        let email = 'string';
        let introduction = 'string';
        const userID = msg.author.id
        let filter = (m) => { !msg.author.bot, msg.author.id === userID };
        let options = {
            max: 2,
            time: 500
        };
        counter = 0;

        let collector = msg.channel.createMessageCollector(filter, options);
        collector.on('collect', (m) => {
            if (counter == 1) {
                name = m.content;
                msg.channel.send("What is your email?")
            }
            if (counter == 3) {
                email = m.content;
                msg.channel.send("Tell us about yourself")
            }
            if (counter == 5) {
                introduction = m.content;
                msg.channel.bulkDelete(6);
                collector.stop();
                
            }
            counter += 1
        });
        collector.on('end', (collected) => {
            console.log(`Collected ${collected.size} items`);
            const person = new introductionObject({
                name: name,
                discordid: msg.author.id,
                email: email,
                information: introduction,
                date : getDateAndTime()
            })
            person.save()
            
            const Title = `Introduction of ${msg.author.username}`
            const description = `Email : ${email}`
            const fields = [
                { name: 'Introduction', value: `${introduction}`, inline: true },
            ]
            const introductionEmbed = embedCommand(client,Title, fields, description);

            msg.channel.send({ embeds: [introductionEmbed], ephemeral: true });
        });

    }

})

client.login(process.env.DISCORD_BOT_TOKEN);




