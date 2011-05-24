karhu.Product = function(attributes, categories) {
  var category = _.find(categories, function(category) {
    return parseInt(category.id, 10) === parseInt(attributes.category_id, 10);
  });
  
  return _(attributes).extend({category: category});
};