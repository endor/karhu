karhu.Product = function(attributes, categories) {
  var category = _.find(categories, function(category) {
    return parseInt(category.id, 10) === parseInt(attributes.category_id, 10);
  });
  
  var product = {};

  product.validations = function() {
    return {
      rules: {
        'product[name]': {
          required: true,
          maxlength: 100
        },
        'product[description]': {required: true},
        'product[unit_price]': {
          required: true,
          formatted: /^(\d{1,3}([.,]\d{3})*|(\d+))([.,]\d{2})?( )?[€$]$/
        },
        'product[valid_to]': {
          required: true,
          dateLargerThan: Date.today()
        }
      },
      messages: {
        'product[name]': {
          required: 'cannot be empty',
          maxlength: 'cannot be longer than 100 characters'
        },
        'product[description]': 'cannot be empty',
        'product[unit_price]': {
          required: 'cannot be empty',
          formatted: 'wrong format, example: 1.230,77€'
        },
        'product[valid_to]': {
          required: 'cannot be empty',
          dateLargerThan: 'has to be today or after'
        }
      }
    };
  };
  
  return _.extend(product, attributes, {category: category});
};