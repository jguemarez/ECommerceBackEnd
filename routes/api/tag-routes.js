// Initialazing the router for the enpoint `/api/tags`.
const router = require('express').Router();
// Importing the models relevant to the routes.
const { Tag, Product, ProductTag } = require('../../models');

// Routes for the `/api/tags` endpoint.

// Retrieves all available tags, together with the products it has been put on.
router.get('/', async (req, res) => {

  try{

    const allTags = await Tag.findAll({
      include:[{ model: Product, through: ProductTag, as: "tag_products"}]
    });

    if(!allTags.length) return res.status(404).json({ message: "Sorry. We are in the process of re-classifying our inventory."});

    return res.status(200).json(allTags);

  } catch(err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

router.get('/:id', async (req, res) => {

  const tagId = req.params.id;

  try{

    const singleTag = await Tag.findByPk(tagId,{
      include: [{ model: Product, through: ProductTag, as: "tag_products" }]
    });

    if(!singleTag) return res.status(404).json({ message: "No tag was found with the given id."});

    return res.status(200).json(singleTag);

  } catch(err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

  router.post('/', async (req, res) => {

    const newTagData = {
  
        tag_name: req.body.tag_name,
        productIds: req.body.productIds //An array with the id numbers of the selected tags
    };
  
    try {
  
        const newTag = await Tag.create(newTagData);
  
        const { productIds } = newTagData;
        
        if(!productIds.length) return res.status(200).json(newTag);
  
        const productTagIdArr = productIds.map((product_id) => ({ product_id, tag_id: newTag.id}));
  
        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
  
        return res.status(200).json(productTagIds);
  
    } catch(err) {
  
        console.error(err);
        return res.status(400).json(err);
         
    };
  });

router.put('/:id', (req, res) => {
  // Update tag data using the body of the request object
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      if (req.body.productIds && req.body.productIds.length) {

        ProductTag.findAll({
          where: { tag_id: req.params.id }
        }).then((tagProducts) => {
          // create filtered list of new tag_ids
          const productTagIds = tagProducts.map(({ product_id }) => product_id);
          const newProductTags = req.body.productIds
            .filter((product_id) => !productTagIds.includes(product_id))
            .map((product_id) => {
              return {
                product_id,
                tag_id: req.params.id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = tagProducts
            .filter(({ product_id }) => !req.body.productIds.includes(product_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(tag);
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {

  const tagToDeleteId = req.params.id;

  try{

    const tagWasDeleted = await Tag.destroy({
      where:{
        id:tagToDeleteId
      }
    });

    if(!tagWasDeleted) return res.status(404).json({ message: "No tag with the given id was found."});

    await ProductTag.destroy({
      where: {
        tag_id: tagToDeleteId
      }
    });

    return res.status(200).json(tagWasDeleted);

  } catch(err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

// Export the router for the endpoint `/api/tags`
module.exports = router;
