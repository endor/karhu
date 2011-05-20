karhu.EditProduct = function(product, categories) {
  _(categories).chain().select(function(category) {
    return parseInt(category.id, 10) === parseInt(product.category_id, 10);
  }).first().value().selected = true;

  return _.extend(product, {categories: categories});
}