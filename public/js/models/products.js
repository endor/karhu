karhu.ProductCollection = Backbone.Collection.extend({
  model: karhu.Product,
  url: '/products',
  toTemplate: function() {
    return this.map(function(model){ return model.toTemplate(); });
  }  
});