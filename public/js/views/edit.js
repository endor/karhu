karhu.EditView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .add": "addItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'addItem', 'template', 'data');
    this.render();
  },
  
  render: function() {
    var context = this, data = this.data();
    $.get(this.template(), function(template) {
      context.el.html(Mustache.to_html(template, data));
    });    
  },
  
  addItem: function(evt) {
    evt.preventDefault();

    var data = {};
    this.el.find('input:text, textarea').each(function(idx, element) {
      data[$(element).attr('name')] = $(element).val();
    });
    this.collection.create(data);
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

