karhu.Product = Backbone.Model.extend({
  toTemplate: function() {
    return _.extend(this.toJSON(), {category: this.category().toJSON()});
  },
  
  category: function() {
    return karhu.Categories.get(this.get('category_id'));
  }
});