karhu.NewView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .add": "addItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'addItem', 'template', 'data');
  },
  
  addItem: function(evt) {
    evt.preventDefault();

    var data = this._collectFormData();

    if(!this.collection.create(data)) {
      this._showErrorsFor(data);
    }
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