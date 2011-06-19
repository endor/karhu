karhu.MainView = Backbone.View.extend({
  el: $('.main'),
  
  events: {
    "click .new": "renderNew",
    "click .add": "addItem"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'renderNew', 'addItem', 'template', 'data');
    this.collection.bind('change', this.render);
    this.render();
  },
  
  renderNew: function() {
    var context = this, data = this.data();
    $.get(this.template('new'), function(template) {
      context.el.html(Mustache.to_html(template, data));
    });    
  },
  
  addItem: function(evt) {
    var data = {};
    this.el.find('input:text, textarea').each(function(idx, element) {
      data[$(element).attr('name')] = $(element).val();
    });
    this.collection.add(data);
    evt.preventDefault();
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

