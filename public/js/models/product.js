karhu.Product = function(attributes, categories) {
  var category = _.find(categories, function(category) {
    return parseInt(category.id, 10) === parseInt(attributes.category_id, 10);
  });
  
  var product = attributes || {};

  if(product.unit_price) {
    if(_.isString(product.unit_price)) {
      product.unit_price = $.global.parseFloat(product.unit_price.match(/[\d\.\,]+/)[0]);
    }
    var price = product.unit_price;
    product.unit_price = $.global.format(product.unit_price, "n") + '€';
  }
  
  product.toJSON = function() {
    return _.extend(product, {unit_price: price});
  };

  var regular_expressions = {
    en: {
      unit_price: /^(\d{1,3}([,]\d{3})*|(\d+))([.]\d{2})?( )?€?$/,
      valid_to: /\d{2}\/\d{2}\/\d{4}/
    },
    de: {
      unit_price: /^(\d{1,3}([.]\d{3})*|(\d+))([,]\d{2})?( )?€?$/,
      valid_to: /\d{2}\.\d{2}\.\d{4}/
    }
  };
  
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
          formatted: regular_expressions[karhu.locale].unit_price
        },
        'product[valid_to]': {
          required: true,
          formatted: regular_expressions[karhu.locale].valid_to,
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
          dateLargerThan: 'today_or_after',
          formatted: 'wrong_format_date'
        }
      }
    };
  };
  
  return _.extend(product, {category: category});
};