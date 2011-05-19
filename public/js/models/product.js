karhu.Product = function(attributes, categories) {
  var category = _.select(categories, function(category) {
    return category.id === attributes.category_id;
  });
  
  return _(attributes).extend({category: category});
};