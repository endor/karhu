karhu.NewView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .add": "addItem",
    "click .cancel": "cancel"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'addItem', 'template', 'data', 'cancel');
  },
  
  addItem: function(evt) {
    evt.preventDefault();

    var data = this._collectFormData();

    if(!this.collection.create(data)) {
      this._showErrorsFor(data);
    }
  },
  
  cancel: function(evt) {
    evt.preventDefault();
    karhu.views.main.render();
  },
  
  template: function() {
    return 'templates/' + this.className + '/new.mustache';
  },
  
  data: function() {
    return {
      categories: karhu.Categories.toJSON(),
      products: karhu.Products.toJSON()
    };
  }
});