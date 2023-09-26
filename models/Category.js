//Import the necessary objects from Sequelize
const { Model, DataTypes } = require('sequelize');
//Require the sequelize connection to sync the model with the MySQL db.
const sequelize = require('../config/connection.js');
//Stipulate that 'Category' is achild class of 'Model'
class Category extends Model {}
//Initializing (eq. to sequelize.define) the model
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);
//Exporting the model so other modules can use it
module.exports = Category;
