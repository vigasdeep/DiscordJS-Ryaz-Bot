

function employee(){
    this.name = "Name";
    this.availableCoins = 0;
    this.updateInfo = function(name,coins){
        this.name = name;
        this.availableCoins = coins;
    }

}

module.exports = employee 