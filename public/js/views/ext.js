Backbone.View.prototype._collectFormData = function() {
  var data = {};
  this.el.find('input:text, input:password, textarea, select').each(function(idx, element) {
    data[$(element).attr('name')] = $(element).val();
  });
  return data;
};

Backbone.View.prototype._showErrorsFor = function(data) {
  var model = new this.collection.model(),
    validator = this.el.find('form').validate();

  validator.showErrors(model.validate(data));
};

Backbone.View.prototype.cancel = function(evt) {
  evt.preventDefault();
  karhu.views.main.render();
};

Backbone.View.prototype.render = function() {
  var context = this, data;
  if(this.data) { var data = this.data(); }
  $.get(this.template(), function(template) {
    context.el.html(Mustache.to_html(template, data));
    if(context.afterRender) { context.afterRender(); }
  });
  return this;
};