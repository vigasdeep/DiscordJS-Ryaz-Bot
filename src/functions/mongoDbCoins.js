require('dotenv').config();
const mongoose = require('mongoose');
// const {mongodbAtlasLink} = require('./config.json');
const mongodbAtlasLink = process.env.MONGODB_LINK;

const  connectToDb = () =>{
    mongoose.connect(mongodbAtlasLink,{
        useNewUrlparser : true,
        useUnifiedTopology: true,
        })
    .then(() => console.log("connection is successfull"))
    .catch((err) => console.log(err));
}

const employeeSchema = new mongoose.Schema({
    name : String,
    recieveCoins: Boolean,
    coins: Number,
    discordid: Number,
    sentLogs : Array,
    recieveLogs : Array,
    addcoinsLogs : Array
})
// new collection below
const EmployeeData = new mongoose.model("CoinLogs",employeeSchema)

//create document
const employee = new EmployeeData({
    name : 'harsh',
    coins : 20,
    sentLogs : [],
    recieveLogs : []
})

function getDateAndTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes()
    var dateAndTime = `${date} ${time}`;
    return dateAndTime;
}

async function findUser(id){
    const model = await EmployeeData.findOne({discordid:id});
    return model
}



async function addCoins(id,amount){
    const query = { discordid: id };
    const model = await EmployeeData.findOne(query);
    const coinsToAdd = amount;
    if (model.coins === 0){
        newCoins = coinsToAdd;
    }else{
        newCoins = model.coins+coinsToAdd;
    }
    const time = getDateAndTime()
    const elementToPush = `Added: ${newCoins} coins on ${time}`;
    await EmployeeData.findOneAndUpdate(query,{$set:{coins:`${newCoins}`}});
    await EmployeeData.findOneAndUpdate(query, {$push: { addcoinsLogs: elementToPush }});
    
}

async function addCoinsToAll(amount){
 const time = getDateAndTime()
 const query =  { recieveCoins: true};
 const elementToPush = `Added: ${amount} coins on ${time}`;
 await EmployeeData.updateMany(query,{$inc: { coins: amount}});
 await EmployeeData.findOneAndUpdate(query, {$push: { addcoinsLogs: elementToPush }});
 sentTo = await EmployeeData.find(query);
 return sentTo;
}

async function getCoins(id){
    const query =  { discordid: id};
    data = await EmployeeData.findOne(query);
    coins = data.coins;
    return coins;
}

async function transferCoins(senderid,recieverid,amount,senderName,recieverName,reason){
    const time = getDateAndTime()
    const sent = `Transfered: ${amount} coins on ${time} to ${recieverName}. Reason : ${reason}`;
    await EmployeeData.findOneAndUpdate({discordid:senderid},{$inc: { coins: -amount}});
    await EmployeeData.findOneAndUpdate({discordid:senderid}, {$push: { sentLogs: sent }});
    const recieve = `Got ${amount} coins on ${time} from ${senderName}. Reason: ${reason}`;
    await EmployeeData.findOneAndUpdate({discordid:recieverid},{$inc: { coins: amount}});
    await EmployeeData.findOneAndUpdate({discordid:recieverid}, {$push: { recieveLogs: recieve }});
}

// updateData();
module.exports = {
    connectToDb: connectToDb,
    EmployeeData :EmployeeData,
    findUser: findUser,
    addCoins: addCoins,
    addCoinsToAll:addCoinsToAll,
    getCoins: getCoins,
    transferCoins :transferCoins,
    getDateAndTime: getDateAndTime,
};
