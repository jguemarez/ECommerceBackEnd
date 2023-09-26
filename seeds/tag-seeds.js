//Importing Sequelize "tag" model
const { Tag } = require('../models');
//Data array used to populate the table corresponding to "tag"
const tagData = [
  {
    tag_name: 'rock music',
  },
  {
    tag_name: 'pop music',
  },
  {
    tag_name: 'blue',
  },
  {
    tag_name: 'red',
  },
  {
    tag_name: 'green',
  },
  {
    tag_name: 'white',
  },
  {
    tag_name: 'gold',
  },
  {
    tag_name: 'pop culture',
  },
];
//Defining function expression to seed the aforementioned table by applying the .bulkCreate method to the model, passing the array as argument
const seedTags = () => Tag.bulkCreate(tagData);
//Exporting the seeding arrow function
module.exports = seedTags;
