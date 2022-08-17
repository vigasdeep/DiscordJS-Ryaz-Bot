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

async function updateIntroData(id,name,email,information,date){
    const query = { discordid: id };
    await introductionObject.findOneAndUpdate(query,{$set:{name:name}});
    await introductionObject.findOneAndUpdate(query,{$set:{email:email}});
    await introductionObject.findOneAndUpdate(query,{$set:{information:information}});
    await introductionObject.findOneAndUpdate(query,{$set:{date:date}});
}

module.exports = {
    introductionObject:introductionObject,
    findUserInfo:findUserInfo,
    updateIntroData:updateIntroData,
};  
