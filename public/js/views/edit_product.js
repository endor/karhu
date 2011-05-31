karhu.EditProduct = function(product, categories, last_edited_product) {
  if(last_edited_product) {
    var data = {};
    
    _.each(last_edited_product.data, function(val, key) {
      if(val !== "") { data[key] = val; }
    });
    
    _.extend(product, data);
  }

  if(product.category_id) {
    _(categories).chain().select(function(category) {
      return parseInt(category.id, 10) === parseInt(product.category_id, 10);
    }).first().value().selected = true;
  }

  if(_.isString(product.unit_price)) {
    product.unit_price = $.global.parseFloat(product.unit_price.match(/[\d\.\,]+/)[0]);
  }
  product.unit_price = $.global.format(product.unit_price, "n") + '€';

  return _.extend(product, {categories: categories});
}