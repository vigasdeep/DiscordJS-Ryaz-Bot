
require('dotenv').config();

const { introductionObject, } = require('../functions/mongoDbIntroduction');
const {  getDateAndTime } = require('../functions/mongoDbCoins');
const {messageEmbedCommand} = require('../functions/embed')

const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;

module.exports = {
    name: 'messageCreate',
    async execute(msg,client) {
        client = msg.client;
    if (msg.author.bot) return;
    let isWelcomeMessage = msg.type === 7

    if (isWelcomeMessage) {
        const Title = `Welcome ${msg.author.username}`
        const description = `Please use /introduce to give your introduction`
        const introductionEmbed = messageEmbedCommand(msg, Title, null, description);
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
                date: getDateAndTime()
            })
            person.save()

            const Title = `Introduction of ${msg.author.username}`
            const description = `Email : ${email}`
            const fields = [
                { name: 'Introduction', value: `${introduction}`, inline: true },
            ]
            const introductionEmbed = messageEmbedCommand(msg, Title, fields, description);

            msg.channel.send({ embeds: [introductionEmbed], ephemeral: true });
        });

    }


    },
};