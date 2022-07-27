

function employee(){
    this.name = "Name";
    this.availableCoins = 10;
    this.updateCoins = function(coins){
        this.availableCoins = coins;
    }
    this.Set = function(name,coins){
        this.name = name;
        this.availableCoins = coins;
    }

}
 //"999885652399231046","838637875636600862",
// function employeeObj(name,coin){
//       name : name,{
//        availcoin : coin,
//     };
//     return Name;
// }

module.exports = employee ;
// module.exports = employeeObj;
