karhu.EditProduct = function(product, categories) {
  categories = categories.map(function(category) {
    if(parseInt(category.id, 10) === parseInt(product.category_id, 10)) {
      category.selected = true;
    }
    return category;
  });
  return _.extend(product, {categories: categories});
}