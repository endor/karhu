karhu.ProductCollection = Backbone.Collection.extend({
  model: karhu.Product,
  url: '/products'
});