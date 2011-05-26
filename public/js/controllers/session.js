karhu.Session = function(app) {
  app.get('#/session/new', function(context) {
    context.objectForValidation = new karhu.SessionValidations();
    context.partial('templates/session/new.mustache');
  });
  
  app.put('#/session', function(context) {
    karhu.user = context.params.session.user;
    karhu.password = context.params.session.password;
    
    context.ajax_get('/categories', {}, function() {
      delete karhu.password;
      context.store.set('token', karhu.token);
      context.store.set('user', karhu.user);
      context.redirect('#/products');
    }, function() {
      var validator = $('.main form').validate(),
        message = $.global.localize("karhu")['invalid_user_password_combination'];
      validator.showErrors({'session[password]': message});
    });    
  });
};