karhu.Session = Backbone.Model.extend({
  validate: function(attrs) {
    var errors = {};
    if(!attrs.user || attrs.user.length === 0) {
      errors['user'] = karhu.i18n.translate('cannot_be_empty');
    }
    if(!attrs.password || attrs.password.length === 0) {
      errors['password'] = karhu.i18n.translate('cannot_be_empty');
    }
    if(!_.isEmpty(errors)) { return errors; }
  },
  
  url: function() {
    return '/session';
  },
  
  save: function(options) {
    var error = this.validate(this.attributes);
    if(error) { options.error(error); return; }
    
    Backbone.sync.user = this.get('user');
    Backbone.sync.password = this.get('password');

    Backbone.sync('read', {url: '/categories'}, {
      success: function() {
        options.success()
      },
      error: function() {
        options.error({password: karhu.i18n.translate('invalid_user_password_combination')});
      }
    });
  },
  
  destroy: function() {
    delete Backbone.sync.token;
    store.remove('token');
  }
});