karhu.CategoryCollection = Backbone.Collection.extend({
  model: karhu.Category,
  url: '/categories',
  toTemplate: function() {
    return this.map(function(model){ return model.toTemplate(); });
  }
});