const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const Tags = await Tag.findAll({
      include: [{model:Product}, {model:ProductTag}],
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT * FROM product_tag WHERE tag.id = product_tag.tag_id)'
          ),
          'tag_id',
        ],
      ],
    },
    });
    res.status(200).json(Tags);
  } catch (err) {
    res.status(500).json(err);
  }
  });

router.get('/:id', async (req, res) => {
  try {
    const Tags = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }, {model:ProductTag}],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT * FROM product_tag WHERE tag.id = product_tag.tag_id)'
            ),
            'tag_id',
          ],
        ],
      },
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
    if (!Tags) {
      res.status(404).json({ message: 'Cannot locate that tag' });
      return;
    }
    res.status(200).json(Tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
