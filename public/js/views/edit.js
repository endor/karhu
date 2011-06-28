karhu.EditView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .update": "updateItem",
    "click .cancel": "cancel"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'updateItem', 'template', 'data', 'cancel');
  },
  
  afterRender: function() {
    if(this.className === 'products') {
      this.$('#category_id [value="' + this.model.get('category_id') + '"]').attr('selected', 'selected');
    }
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
      object: this.model.toTemplate()
    };
  }
});