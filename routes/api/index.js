//Requiring Express and initializing a router at once.
const router = require('express').Router();
//Importing the routes that serve to perform CRUD operations on the tables uniquely associated to the "category","product", and "tag" Sequelize models, in that order.
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');
const prouduct_tagRoutes = require('./product_tag-routes');
//Turning on the router for the aforementioned routes. 
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);
router.use('/product_tags', prouduct_tagRoutes);
//Exporting the router
module.exports = router;
