const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Product, Category, Tag, ProductTag } = require('../../models');

async function init() {
  try {
    await sequelize.sync(); // Synchronize models with the database
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
}
router.get('/', async (req, res) => {
  try {
    const Tags = await Tag.findAll();
    if (!Tags) {
      return res.status(404).json({ message: 'No tags found from GET ' });
    }
    
    res.status(200).json(Tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error from GET' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const Tags = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as:'some_tag' }],
    });

    if (!Tags) {
      res.status(404).json({ message: 'Tag id not found' });
      return;
    }

    res.status(200).json(Tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then((tag) => {
    if (req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(tag);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      if (req.body.productIds && req.body.productIds.length) {

        ProductTag.findAll({
          where: { tag_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ product_id }) => product_id);
          const newProductTags = req.body.productIds
            .filter((product_id) => !productTagIds.includes(product_id))
            .map((product_id) => {
              return {
                tag_id: req.params.id,
                product_id,
              };
            });
          const productTagsToRemove = productTags
            .filter(({ product_id }) => !req.body.productIds.includes(product_id))
            .map(({ id }) => id);
       
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(tag);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const Tags = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (Tags === 0) {
      res.status(404).json({ message: 'Cannot locate that tag' });
      return;
    }
    res.status(200).json(Tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
