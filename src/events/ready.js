
const { connectToDb } = require('../functions/mongoDbCoins');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        connectToDb();
        console.log(`${client.user.tag} has logged in.`);
    },
};