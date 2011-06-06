karhu.EditProduct = function(attributes, categories, last_edited_product) {
  _.extend(attributes, (last_edited_product || {}).data);
  _.extend(this, attributes);

  attributes.valid_to = attributes.valid_to || defaultValidTo();

  if(this.category_id) {
    var category_id = this.category_id;
    _(categories).chain().select(function(category) {
      return parseInt(category.id, 10) === parseInt(category_id, 10);
    }).first().value().selected = true;
  }

  var product = new karhu.Product(attributes);
  this.unit_price = product.unit_price;
  this.valid_to = product.valid_to;
  this.categories = categoriesWithId(categories);

  function categoriesWithId(categories) {
    return _.reject(categories, function(category) {
      return !category.id;
    });
  }
  
  function defaultValidTo() {
    return (1).year().fromNow().toString('MM/dd/yyyy');
  }
};