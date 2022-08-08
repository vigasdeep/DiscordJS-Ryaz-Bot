const mongoose = require('mongoose');


const introductionSchema = new mongoose.Schema({
    name : String,
    discordid: Number,
    email : String,
    information : String
})
// new collection below
const introductionObject = new mongoose.model("IntroductionLogs",introductionSchema);

module.exports = {
    introductionObject:introductionObject,
};  
