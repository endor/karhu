karhu.Category = Backbone.Model.extend({
  toTemplate: function() {
    return this.toJSON();
  }
});