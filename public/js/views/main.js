karhu.MainView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .remove": "removeItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'template', 'data', 'removeItem');
    this.collection.bind('add', this.render);
    this.collection.bind('remove', this.render);
    this.render();
  },
  
  render: function() {
    var context = this, data = this.data();
    $.get(this.template(), function(template) {
      context.el.html(Mustache.to_html(template, data));
    });
    window.location.href = '#/' + this.className;
    return this;
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

