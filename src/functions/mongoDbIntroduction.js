const mongoose = require('mongoose');


const introductionSchema = new mongoose.Schema({
    name : String,
    discordid: Number,
    email : String,
    information : String,
    date: String,
})
// new collection below
const introductionObject = new mongoose.model("IntroductionLogs",introductionSchema);

async function findUserInfo(id){
    const model = await introductionObject.findOne({discordid:id});
    return model
}


module.exports = {
    introductionObject:introductionObject,
    findUserInfo:findUserInfo,
};  
