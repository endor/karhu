karhu.SessionView = Backbone.View.extend({
  el: $('.main'),

  events: {
    "click .login": "login"
  },
  
  initialize: function() {
    _.bindAll(this, 'render', 'login');
    this.render();
  },
  
  login: function(evt) {
    evt.preventDefault();

    var data = this._collectFormData(),
      context = this,
      session = new karhu.Session(data);

    session.save({
      success: function() {
        window.location.href = "#/categories";
      },
      error: function(errors) {
        validator = context.el.find('form').validate();
        validator.showErrors(errors);
      }
    });
  },
  
  template: function() {
    return 'templates/session/new.mustache';
  }
});