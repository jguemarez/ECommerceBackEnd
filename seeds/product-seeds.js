//Importing the "product" Sequelize model initialized whithin the "models" folder
const { Product } = require('../models');

//Data array to seed the rows and fields of the MySQl table onto which the "product" model maps.
const productData = [
  {
    product_name: 'Plain T-Shirt',
    price: 14.99,
    stock: 14,
    category_id: 1,
  },
  {
    product_name: 'Running Sneakers',
    price: 90.0,
    stock: 25,
    category_id: 5,
  },
  {
    product_name: 'Branded Baseball Hat',
    price: 22.99,
    stock: 12,
    category_id: 4,
  },
  {
    product_name: 'Top 40 Music Compilation Vinyl Record',
    price: 12.99,
    stock: 50,
    category_id: 3,
  },
  {
    product_name: 'Cargo Shorts',
    price: 29.99,
    stock: 22,
    category_id: 2,
  },
];

//Function expression to seed the data from the previous array into the model's corresponding table by invoking bulkCreate method.
const seedProducts = () => Product.bulkCreate(productData);

//Exporting the seeding arrow function.
module.exports = seedProducts;
