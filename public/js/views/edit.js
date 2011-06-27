karhu.EditView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .update": "updateItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'updateItem', 'template', 'data');
  },
  
  updateItem: function(evt) {
    evt.preventDefault();

    var data = this._collectFormData();

    if(!this.model.set(data)) {
      this._showErrorsFor(data);
    } else {
      this.model.save();
    }
  },
  
  template: function() {
    return 'templates/' + this.className + '/edit.mustache';
  },
  
  data: function() {
    return {
      categories: karhu.Categories.toJSON(),
      products: karhu.Products.toJSON(),
      object: this.model.toJSON()
    };
  }
});