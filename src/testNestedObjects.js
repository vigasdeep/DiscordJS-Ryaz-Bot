
const person1 = {
    name: 'joe',
    age: 51,
}
const save = (person) => {
    const newPerson = {
        name: person.name,
        age: person.age,
        pets: {}
    }
    data[person.name] = newPerson
    saveData(data, 'data.json')
}

const savePet = (pet) => {
    const newPet = {

        name: pet.name,
        animal: pet.animal,
        breed: pet.breed,
        color: pet.color,
        owner: pet.owner,
    }
    console.log(data);
    data[pet.owner].pets[pet.name] = newPet;
    saveData(data, 'data.json');
}
const pet = {
    name: 'pharaoh',
    animal: 'cat',
    breed: 'sphinx',
    color: 'golden',
    owner: 'joe'
}
// save(person1)
// savePet(pet)


// {
//     "837281081634979861": {
//       "name": "Harsh Zode",
//       "id": "837281081634979861",
//       "availableCoins": 110,
//       "amountTransfered": {}
//     },
//     "999889194681901169": {
//       "name": "Ryaz bot",
//       "id": "999889194681901169",
//       "availableCoins": 110,
//       "amountTransfered": {}
//     }
//   }
