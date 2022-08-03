

function employee(){
    this.name = "Name";
    this.availableCoins = 0;
    this.sentLog = [];
    this.recieveLog = [];
    this.updateCoins = function(coins){
        this.availableCoins = coins;
    }
    this.Set = function(name,coins){
        this.name = name;
        this.availableCoins = coins;
    }
}
 //"999885652399231046","838637875636600862",

module.exports = employee ;

