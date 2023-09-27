// Initializing the Express router for the `/api/products` routes
const router = require('express').Router();
// Importing the models relevant to the routes
const { Product, Category, Tag, ProductTag } = require('../../models');

// Routes for the `/api/products` endpoint.

// Retrieve data for all products, including the category they belong to and all their associated tags.
router.get('/', async (req, res) => {
  try {

    const allProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'product_tags', exclude: 'product_tag'}]
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

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json(err);
    });
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
