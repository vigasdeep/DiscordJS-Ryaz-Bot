const fs = require('fs')
const data = JSON.parse(fs.readFileSync('data.json'));

// save data functions
const saveData = (data, file) => {
    const finished = (error) => {
        if (error) {
            console.error(error)
            return;
        }
    }
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFile(file, jsonData, finished)
    console.log('saved')
}

function person() {
    this.name = "ABC";
    this.availableCoins = 110;
    this.id = 445 ;
}

const saveUser = (person) => {
    const newPerson = {
        name: person.name,
        id: person.id,
        availableCoins: person.availableCoins,
        coinsSent: {},
        coinsRecieved: {},
    }
    data[person.id] = newPerson;
    saveData(data, 'data.json');
}

const SenderLogs = (log) => {
    const newlog = {
        recipientName: log.recipientName,
        recipientId: log.recipientId,
        amountTransfered: log.amountTransfered,
    }
    data[log.senderId].coinsSent[log.recipientName] = newlog;
    saveData(data, 'data.json');
    console.log(data);
}

const ReceiverLogs = (log) => {
    const newlog = {
        senderName: log.senderName,
        senderId: log.senderId,
        amountTransfered: log.amountTransfered,
    }
    data[log.recipientId].coinsRecieved[log.senderName] = newlog;
    saveData(data, 'data.json');
    console.log(data);
}

function coinTransferLog (senderName,senderId,recipientName,recipientId,amountTransfered) {
    this.senderName  = senderName;
    this.senderId =   senderId;
    this.recipientName = recipientName;
    this.recipientId = recipientId;
    this.amountTransfered = amountTransfered;
}
module.exports = {
    person: person,
    saveUser :saveUser,
    coinTransferLog: coinTransferLog,
    SenderLogs: SenderLogs,
    ReceiverLogs: ReceiverLogs,
};
