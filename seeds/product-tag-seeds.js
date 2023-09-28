//Importing the "product_tag" Sequelize junction model. It holds a pair of non-unique foreign-keys that reference the "product" and "tag" models.
const { ProductTag } = require('../models');

//Data array to fill the MySQL table corresponding to the "product_tag" model. Foreign keys are paired by wrapping them in a JS object.
const productTagData = [
  {
    product_id: 1,
    tag_id: 6,
  },
  {
    product_id: 1,
    tag_id: 7,
  },
  {
    product_id: 1,
    tag_id: 8,
  },
  {
    product_id: 2,
    tag_id: 6,
  },
  {
    product_id: 3,
    tag_id: 1,
  },
  {
    product_id: 3,
    tag_id: 3,
  },
  {
    product_id: 3,
    tag_id: 4,
  },
  {
    product_id: 3,
    tag_id: 5,
  },
  {
    product_id: 4,
    tag_id: 1,
  },
  {
    product_id: 4,
    tag_id: 2,
  },
  {
    product_id: 4,
    tag_id: 8,
  },
  {
    product_id: 5,
    tag_id: 3,
  },
];

//Function expression to populate the table corresponding to the model by invoking the bulkCreate method, passing the previous data array as argument. 
const seedProductTags = () => ProductTag.bulkCreate(productTagData);

//Making the seeding arrow function part of the module's public interface
module.exports = seedProductTags;
