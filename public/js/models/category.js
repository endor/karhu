karhu.Category = function(attributes) {
  this.url = '/categories';

  _.extend(this, attributes);

  this.validations = function() {
    return {
      rules: {
        'category[name]': {
          required: true,
          maxlength: 100
        },
        'category[description]': {
          required: true
        }
      },
      messages: {
        'category[name]': {
          required: 'cannot_be_empty',
          maxlength: 'cannot_be_longer_than_100_characters'
        },
        'category[description]': {
          required: 'cannot_be_empty'
        }
      }
    };
  };
  
  this.toJSON = function() {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    }
  };
};

karhu.Category.all = function(params, callback) {
  params = this.prototype.buildQueryParams(params, 'Categories');

  karhu.backend.get('/categories', params, function(paginated_categories) {
    karhu.objectForPagination = _.extend({}, paginated_categories, {url: '#/categories'});
    callback(paginated_categories.values);
  });
};

karhu.Category.find = function(id, success, error) {
  karhu.backend.get('/categories/' + id, {}, success, error);
};

karhu.Category.prototype = new karhu.Base();