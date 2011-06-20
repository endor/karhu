karhu.MainView = Backbone.View.extend({
  el: $('.main'),
  
  initialize: function() {
    _.bindAll(this, 'render', 'template', 'data');
    this.collection.bind('add', this.render);
    this.render();
  },
  
  render: function() {
    var context = this, data = this.data();
    $.get(this.template(), function(template) {
      context.el.html(Mustache.to_html(template, data));
    });
    return this;
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

