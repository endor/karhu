karhu.MainView = Backbone.View.extend({
  el: $('.main'),
  
  events: {
    "click .new": "renderNew"
  },
  
  renderNew: function() {
    var context = this, data = this.data();
    $.get(this.template('new'), function(template) {
      context.el.html(Mustache.to_html(template, data));
    });    
  },
  
  render: function() {
    var context = this, data = this.data();
    $.get(this.template('index'), function(template) {
      context.el.html(Mustache.to_html(template, data));
    });
    return this;
  },
  
  template: function(type) {
    return 'templates/' + this.className + '/' + type + '.mustache';
  },
  
  data: function() {
    return {
      categories: karhu.Categories.toJSON(),
      products: karhu.Products.toJSON()
    }
  }
});

