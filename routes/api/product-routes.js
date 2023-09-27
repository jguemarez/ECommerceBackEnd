// Initializing the Express router for the `/api/products` routes
const router = require('express').Router();
// Importing the models relevant to the routes
const { Product, Category, Tag, ProductTag } = require('../../models');

// Routes for the `/api/products` endpoint.

// Retrieve data for all products, including the category they belong to and all their associated tags.
router.get('/', async (req, res) => {
  try {

    const allProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'product_tags', exclude: 'product_tag' }]
    });

    if (!allProducts.length) return res.status(404).json({ message: "Sorry. We are out of inventory. Check back soon!" });

    return res.status(200).json(allProducts);

  } catch (err) {

    console.log(err);
    return res.status(500).json(err);

  }
});

// Retrieve data for a particular product, selected by its id, including the category it belongs to and all the associated tags
router.get('/:id', async (req, res) => {

  const productId = req.params.id;

  try {

    const singleProduct = await Product.findByPk(productId, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'product_tags' }]
    });

    if (!singleProduct) return res.status(404).json({ message: "No product was found with the given id." });

    return res.status(200).json(singleProduct);

  } catch (err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

// Add a new product to the inventory
router.post('/', async (req, res) => {

  const newProductData = {

    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    tagIds: req.body.tagIds //An array with the id numbers of the selected tags
  };

  try {

    const newProduct = await Product.create(newProductData);

    const { tagIds } = newProductData;

    if (!tagIds.length) return res.status(200).json(newProduct);

    const productTagIdArr = tagIds.map((tag_id) => ({ product_id: newProduct.id, tag_id }))

    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);

    return res.status(200).json(productTagIds);

  } catch (err) {

    console.error(err);
    return res.status(400).json(err);

  };
});

//Update a product chosen by its id, assuming it exists
router.put('/:id', async (req, res) => {

  const productToUpdateId = parseInt(req.params.id);
  const updateProductData = {

    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    tagIds: req.body.tagIds //An array with the id numbers of the selected tags for the updated product
  }

  try {

    const productExists = await Product.findByPk(productToUpdateId);

    if (!productExists) return res.status(404).json({ message: "No product was found with the given id." });

    const updateData = await Product.update(updateProductData, {
      where: {
        id: productToUpdateId
      }
    });

    const { tagIds } = updateProductData;

    if (!tagIds.length) return res.status(200).json(updateData);



    const oldProductTags = await ProductTag.findAll({
      where: {
        product_id: productToUpdateId
      }
    });

    const oldProductTagIds = oldProductTags.map(({ tag_id }) => tag_id);

    const newProductTags = tagIds.filter((tag_id) => !oldProductTagIds.includes(tag_id))
      .map((tag_id) => ({
        product_id: productToUpdateId,
        tag_id
      }));

    const productTagsToRemove = oldProductTags.filter(({ tag_id }) => !tagIds.includes(tag_id))
      .map(({ id }) => id);

    await ProductTag.destroy({ where: { id: productTagsToRemove } });

    await ProductTag.bulkCreate(newProductTags);

    return res.status(200).json(updateData);

  } catch (err) {

    console.error(err);
    return res.status(400).json(err);
  }

});

// Delete one product from the inventory, selecting it by its id.
router.delete('/:id', async (req, res) => {

  const productToDeleteId = req.params.id;

  try {

    const productWasDeleted = await Product.destroy({
      where: {
        id: productToDeleteId
      }
    });

    if (!productWasDeleted) return res.status(404).json({ message: "No product was found with the given id." });

    // Delete all the product_tags associated with the given product
    await ProductTag.destroy({
      where: {
        product_id: productToDeleteId
      }
    });

    return res.status(200).json(productWasDeleted);

  } catch (err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

module.exports = router;
