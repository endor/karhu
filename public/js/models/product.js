karhu.Product = function(attributes, categories) {
  this.url = '/products';
  
  _.extend(this, attributes);
  
  attachCategory(this, categories);
  formatPrice(this);
  formatValidTo(this);
  
  this.toJSON = function() {
    return {
      unit_price: this.unit_price_unformatted,
      valid_to: this.valid_to_unformatted.toString('MM/dd/yyyy'),
      category_id: this.category_id,
      id: this.id,
      name: this.name,
      description: this.description
    }
  };

  this.validations = function() {
    return {
      rules: {
        'product[name]': {
          required: true,
          maxlength: 100
        },
        'product[description]': {required: true},
        'product[unit_price]': {
          required: true,
          formatted: regularExpression('unit_price')
        },
        'product[valid_to]': {
          required: true,
          formatted: regularExpression('valid_to'),
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



  function formatPrice(product) {
    if(product.unit_price) {
      if(_.isString(product.unit_price)) {
        product.unit_price = $.global.parseFloat(product.unit_price.match(/[\d\.\,]+/)[0]);
      }
      product.unit_price_unformatted = product.unit_price;
      product.unit_price = $.global.format(product.unit_price, "n") + '€';
    }
  }
  
  function formatValidTo(product) {
    if(product.valid_to) {
      product.valid_to_unformatted = $.global.parseDate(product.valid_to) || Date.parse(product.valid_to);
      product.valid_to = $.global.format(product.valid_to_unformatted, "d");
    }
  }

  function attachCategory(product, categories) {
    product.category = _.find(categories, function(category) {
      return parseInt(category.id, 10) === parseInt(product.category_id, 10);
    });
  }

  function regularExpression(field) {
    return {
      en: {
        unit_price: /^(\d{1,3}([,]\d{3})*|(\d+))([.]\d{2})?( )?€?$/,
        valid_to: /\d{1,2}\/\d{1,2}\/\d{4}/
      },
      de: {
        unit_price: /^(\d{1,3}([.]\d{3})*|(\d+))([,]\d{2})?( )?€?$/,
        valid_to: /\d{1,2}\.\d{1,2}\.\d{4}/
      }
    }[karhu.locale][field];
  }
};


karhu.Product.all = function(params, callback) {
  params = this.prototype.buildQueryParams(params, 'Products');

  karhu.backend.get('/categories', {}, function(categories) {
    karhu.backend.get('/products', params, function(paginated_products) {
      karhu.objectForPagination = _.extend({}, paginated_products, {url: '#/products'});
      products = paginated_products.values.map(function(product) { return new karhu.Product(product, categories); });
      callback(products);
    });
  });
};

karhu.Product.find = function(id, success, error) {
  karhu.backend.get('/products/' + id, {}, success, error);
};

karhu.Product.prototype = new karhu.Base();