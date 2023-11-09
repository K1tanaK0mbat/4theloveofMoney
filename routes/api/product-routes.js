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

init();
// The `/api/products` endpoint

// get all products

router.get('/', async (req, res) => {
  try {
    const Products = await Product.findAll();
    
    if (!Products) {
      return res.status(404).json({ message: 'No products found from GET ' });
    }
    
    res.status(200).json(Products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error from GET' });
  }
});


    router.get('/:id', async (req, res) => {
      try {
        const Products = await Product.findByPk(req.params.id, {
          include: [{ model: Tag, through: ProductTag, as:'some_product' }],
        });
    
        if (!Products) {
          return res.status(404).json({ message: 'Product by that ID was not found by ID' });
        }
    
        res.status(200).json({
          id: Product.id,
          product_name: Product.product_name,
          price: Product.price,
         stock: Product.stock,
         Category: Product.category_id,
        });
        
      } catch (err) {
        res.status(500).json({ message: 'Internal Server Error by ID' });
      }
    });
    

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
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
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const Products = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (Products === 0) {
      return res.status(404).json({ message: 'Product not found from DELETE' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    // Log the error for debugging purposes
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error from DELETE' });
  }
});

module.exports = router;
