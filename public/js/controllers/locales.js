karhu.Locales = function(app) {
  app.get('#/locales/:id', function(context) {    
    var locale = context.params.id;
    if(_.include(['de', 'en'], locale)) {
      this.setLocale(locale);
    }
    context.redirect('#/products');
  });
};