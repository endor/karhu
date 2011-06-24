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
  },
  
  _collectFormData: function() {
    var data = {};
    this.el.find('input:text, textarea, select').each(function(idx, element) {
      data[$(element).attr('name')] = $(element).val();
    });
    return data;
  },
  
  _showErrorsFor: function(data) {
    var model = new this.collection.model(),
      validator = this.el.find('form').validate();

    validator.showErrors(model.validate(data));
  }
});

