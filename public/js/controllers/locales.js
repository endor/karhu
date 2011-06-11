karhu.Locales = function(app) {
  app.get('#/locales/:id', function(context) {    
    var locale = context.params.id;
    if(_.include(['de', 'en'], locale)) {
      karhu.i18n.setLocale(locale);
    }
    context.redirect('#/products');
  });
};