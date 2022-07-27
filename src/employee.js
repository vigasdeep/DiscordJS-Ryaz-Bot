

function employee(){
    this.name = "Name";
    this.availableCoins = 0;
    this.updateCoins = function(coins){
        this.availableCoins = coins;
    }
    this.Set = function(name,coins){
        this.name = name;
        this.availableCoins = coins;
    }

}

// function employeeObj(name,coin){
//       name : name,{
//        availcoin : coin,
//     };
//     return Name;
// }

module.exports = employee ;
// module.exports = employeeObj;
