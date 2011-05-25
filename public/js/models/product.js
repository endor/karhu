karhu.Product = function(attributes, categories) {
  var category = _.find(categories, function(category) {
    return parseInt(category.id, 10) === parseInt(attributes.category_id, 10);
  });
  
  var product = {};

  product.validations = function() {
    return {
      rules: {
        'product[name]': {required: true},
        'product[description]': {required: true},
        'product[unit_price]': {required: true},
        'product[valid_to]': {required: true}
      },
      messages: {
        'product[name]': 'cannot be empty',
        'product[description]': 'cannot be empty',
        'product[unit_price]': 'cannot be empty',
        'product[valid_to]': 'cannot be empty'
      }
    };
  };
  
  return _.extend(product, attributes, {category: category});
};