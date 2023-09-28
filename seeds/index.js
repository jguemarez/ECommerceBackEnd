//Importing the modules that seed data into the tables to which the Sequelize models map
const seedCategories = require('./category-seeds');
const seedProducts = require('./product-seeds.js');
const seedTags = require('./tag-seeds');
const seedProductTags = require('./product-tag-seeds');

//Importing the Sequelize connection to the database
const sequelize = require('../config/connection');

/*Asynchronous function that will seed all the tables in the db by sequentially invoking 
the seeding functions exported by each of the required modules. At each step of the seeding, a succes message will be logged to the terminal.
Every time the db is re-seeded, the already saved data will be deleted due to the { force: true } argument passed to the .sync method*/
const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  await seedCategories();
  console.log('\n----- CATEGORIES SEEDED -----\n');

  await seedProducts();
  console.log('\n----- PRODUCTS SEEDED -----\n');

  await seedTags();
  console.log('\n----- TAGS SEEDED -----\n');

  await seedProductTags();
  console.log('\n----- PRODUCT TAGS SEEDED -----\n');

  process.exit(0);
};

//Starting the seeding 
seedAll();
