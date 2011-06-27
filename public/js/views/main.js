karhu.MainView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .remove": "removeItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'template', 'data', 'removeItem');
    this.collection.bind('add', this.render);
    this.collection.bind('remove', this.render);
    this.collection.bind('change', this.render);
    this.render();
  },
  
  afterRender: function() {
    window.location.href = '#/' + this.className;
  },
  
  removeItem: function(evt) {
    evt.preventDefault();
    
    var id = $(evt.target).attr('data-id'),
      collection = this.collection;

    collection.get(id).destroy({success: function(model, response) {
      collection.remove(model);      
    }});
  },
  
  template: function() {
    return 'templates/' + this.className + '/index.mustache';
  },
  
  data: function() {
    return {
      categories: karhu.Categories.toTemplate(),
      products: karhu.Products.toTemplate()
    };
  }
});