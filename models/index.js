// Import the Sequelize models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Defining the one-to-many relation between the tables corresponding to Category (source) and Product (target)
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL'
})

Product.belongsTo(Category, {
  foreignKey: 'category_id'
})

//Defining the many-to-many relation between the tables corresponding to Product and Tag

Product.belongsToMany(Tag, {
  // Stipulate the junction model where the foreign-key will be stored
  through: {
    model: ProductTag,
    unique: false
  },
  // Define an alias for when data is retrieved
  as: 'product_tags'
});

Tag.belongsToMany(Product, {
  // Stipulate the junction model where the foreign-key will be stored
  through: {
    model: ProductTag,
    unique: false
  },
  // Define an alias for when data is retrieved.
  as: 'tag_products'
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
