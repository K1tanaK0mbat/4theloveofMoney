const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Product, Category, } = require('../../models');

async function init() {
  try {
    await sequelize.sync(); // Synchronize models with the database
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
}

init();

router.get('/', async (req, res) => {
try {
  const CategoryData = await Category.findAll();
  res.status(200).json(CategoryData);
} catch (err) {
  res.status(500).json(err);
}
});

router.get('/:id', async (req, res) => {
  try {
    const CategoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT * FROM product WHERE category.id = product.category_id)'
            ),
            'category_name',
          ],
        ],
      },
    });

    if (!CategoryData) {
      res.status(404).json({ message: 'That category doesnt exist' });
      return;
    }

    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const CategoryData = await Category.create(req.body);
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
  const CategoryDate = await Category.update({category_name:
    req.body.category_name,},
    {where: {
      id: req.body.id,},
    }
  );
  if (!CategoryDate) {
    res.status(404).json({ message: 'That category doesnt exist' });
    return;
  }
  res.status(200).json({message:'Changes to category were successful'});
} catch (err) {
  res.status(500).json(err);
}
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const CategoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!CategoryData) {
      res.status(404).json({ message: 'That category doesnt exist' });
      return;
    }
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
