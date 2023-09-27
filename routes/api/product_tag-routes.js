// Initializing the Express router for the `/api/products` routes
const router = require('express').Router();
// Importing the models relevant to the routes
const { Product, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
try{
    const product_Tags = await ProductTag.findAll({
        attributes :{
            exclude: ['productId', 'tagId']
        }
    });

    if(!product_Tags.length) return res.status(404).json({ message: "Sorry. We are in the process of replenishing and reclassifying our inventory."})

    return res.status(200).json(product_Tags);

} catch(err) {
    console.error(err);
    return res.status(500).json(err);
}
});

module.exports = router;