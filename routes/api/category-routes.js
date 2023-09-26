// Turning on the router
const router = require('express').Router();
// Importing the models relevant to this endpoint's routes
const { Category, Product } = require('../../models');

// Routes for the `/api/categories` endpoint.

// Retrieves all of the categories together with their associated products
router.get('/', async (req, res) => {

  try {
    const allCategories = await Category.findAll({
      include: [{ model: Product }]
    });

    if(!allCategories) return res.status(404).json({ message: "Sorry. We are in the process of re-categorizing our inventory."})

    return res.status(200).json(allCategories);

  } catch (err) {

    console.error(err);
    return res.status(500).json(err);

  }
});

// Retrieves a particular category by its id, together with its associated products
router.get('/:id', async (req, res) => {

  const categoryId = req.params.id;
  
  try {
    const singleCategory = await Category.findByPk(categoryId,{
      include: [{ model: Product }]
    });

    if (!singleCategory) return res.status(404).json({ message: "No category with the given id was found."});

    return res.status(200).json(singleCategory);
  } catch (err) {

    console.error(err);
    return res.status(500).json(err);
  }
});

// Adds a new category to the inventory
router.post('/', async (req, res) => {

  const newCategoryName = req.body.category_name;

  try {
    if (typeof newCategoryName === 'string'){

      const newCategory = await Category.create({ category_name: newCategoryName });

      return res.status(201).json(newCategory);

    } else {

      return res.status(400).json({ message: "The new category's name must be a nonempty string, no longer than 255 characters." })

    }
} catch (err) {

  console.error(err);
  return res.status(500).json(err);

}
});

// Updates an already existing category, selected by its id, by changing its name
router.put('/:id', async (req, res) => {

  const updateData = {
    category_name : req.body.category_name
  };
  const categoryId = req.params.id;

  try{

    if(typeof updateData.category_name === 'string'){
    const [ categoryWasUpdated ] = await Category.update(updateData,{
      where:{
        id : categoryId
      }
    });

    if(!categoryWasUpdated) return res.status(404).json({ message: "No category with the given id was found."});

    return res.status(200).json(categoryWasUpdated);

  } else { 

    return res.status(400).json({ message: "The new category's name must be a nonempty string, no longer than 255 characters." })

  }
  } catch(err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

// Deletes one category, selecting it by its id.
router.delete('/:id', async (req, res) => {

  const categoryToDeleteId = req.params.id;

  try{

    const categoryWasDeleted = await Category.destroy({
      where: {
        id: categoryToDeleteId
      }
    });

    if(!categoryWasDeleted) return res.status(404).json({ message: "No category with the given id was found."})

    return res.status(200).json(categoryWasDeleted);
  } catch(err) {

    console.error(err);
    return res.status(500).json(err);
  }
});

// Export the router for the `/api/categories` endpoint
module.exports = router;
