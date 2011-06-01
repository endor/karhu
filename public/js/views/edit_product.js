karhu.EditProduct = function(product, categories, last_edited_product) {
  if(last_edited_product) {
    var data = {};
    
    _.each(last_edited_product.data, function(val, key) {
      if(val !== "") { data[key] = val; }
    });
    
    _.extend(product, data);
  }
  
  if(!product.valid_to) {
    product.valid_to = (1).year().fromNow().toString('MM/dd/yyyy');
  }

  if(product.category_id) {
    _(categories).chain().select(function(category) {
      return parseInt(category.id, 10) === parseInt(product.category_id, 10);
    }).first().value().selected = true;
  }

  if(product.unit_price) {
    if(_.isString(product.unit_price)) {
      product.unit_price = $.global.parseFloat(product.unit_price.match(/[\d\.\,]+/)[0]);
    }
    product.unit_price = $.global.format(product.unit_price, "n") + '€';    
  }

  var date = $.global.parseDate(product.valid_to) || Date.parse(product.valid_to);
  product.valid_to = $.global.format(date, "d");

  categories = _.reject(categories, function(category) {
    return !category.id;
  });

  return _.extend(product, {categories: categories});
}