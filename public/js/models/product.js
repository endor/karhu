karhu.Product = Backbone.Model.extend({
  defaults: {
    valid_to: (1).year().fromNow()
  }
});