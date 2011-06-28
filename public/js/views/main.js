karhu.MainView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .remove": "removeItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'template', 'data', 'removeItem');
  },
  
  bind: function(collection) {
    collection.bind('add', this.render);
    collection.bind('remove', this.render);
    collection.bind('change', this.render);
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