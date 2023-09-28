//Importing the "category" Sequelize model defined in the "models" folder.
const { Category } = require('../models');

//Data array for seeding the table onto which the previous model maps.
const categoryData = [
  {
    category_name: 'Shirts',
  },
  {
    category_name: 'Shorts',
  },
  {
    category_name: 'Music',
  },
  {
    category_name: 'Hats',
  },
  {
    category_name: 'Shoes',
  },
];

//Function expression to seed the MySQL table corresponding to the model by applying the bulkCreate method on it, using the previous array as argument.
const seedCategories = () => Category.bulkCreate(categoryData);

//Exporting the seeding arrow function.
module.exports = seedCategories;
