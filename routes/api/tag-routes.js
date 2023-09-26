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

    if(!allTags) return res.status(404).json({ message: "Sorry. We are in the process of re-classifying our inventory."});

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

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
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

    return res.status(200).json(tagWasDeleted);

  } catch(err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

// Export the router for the endpoint `/api/tags`
module.exports = router;
