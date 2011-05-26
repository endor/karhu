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
          required: 'cannot_be_empty',
          maxlength: 'cannot_be_longer_than_100_characters'
        },
        'product[description]': {
          required: 'cannot_be_empty'
        },
        'product[unit_price]': {
          required: 'cannot_be_empty',
          formatted: 'wrong_format_price'
        },
        'product[valid_to]': {
          required: 'cannot_be_empty',
          dateLargerThan: 'today_or_after'
        }
      }
    };
  };
  
  return _.extend(product, attributes, {category: category});
};