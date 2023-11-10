const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

module.exports = router;

/* Category request body example:
{"category_name": "name"}

 Product request body example:
 {
      "product_name": "name",
      "price": "00.00",
      "stock": 0,
	"category_id":1,
      "tagIds": [1, 2]
    }

    Tag request body example:
    {
	"tag_name": "name"
}
  */