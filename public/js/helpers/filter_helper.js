karhu.FilterHelper = {
  clearContextVariables: function(context) {
    context.objectForValidation = null;
  },
  
  markActiveMenuItem: function(context) {
    var type = context.path.match(/\#\/([^\/\?]+)/);
    if(type && type[1] !== 'pages') {
      $('#header nav a, #header nav li').removeClass('active');
      $('#header nav .' + type[1]).addClass('active').parent().addClass('active');
    }
  },
  
  redirectIfCanceled: function(context) {
    if(context.params.cancel) {
      var toClear = ['last_added_product', 'last_edited_product', 'last_added_category', 'last_edited_category'];
      toClear.forEach(function(item) { context.store.clear(item); });      
      var redirect_path = context.path.match(/(\#\/[^\/]+)/)[1];
      context.redirect(redirect_path);
      return false;
    }
  },
  
  initializeLocales: function(callback) {
    ['en', 'de'].forEach(function(locale) {
      $.global.localize("karhu", locale, karhu.locales[locale] || {});
    });
    var locale = this.store.get('locale') || 'en';
    this.setLocale(locale);
    callback();
  },
  
  redirectToLogin: function(callback) {
    if(!this.store.get('token') && !this.path.match(/\#\/session/)) {
      this.redirect('#/session/new');
    } else {
      karhu.token = this.store.get('token');
      karhu.user = this.store.get('user');
      
      if(karhu.token && !this.app.objects_cached) {
        this.cacheObjects();
      }
      
      callback();
    }
  },
  
  redirectToLastAccessedItem: function(callback) {
    var key = _.find(this.store.keys(), function(key) { return key.match(/last\_(edited|added)/); });

    if(key) {
      this.accessLastItem(key, callback);
    } else {
      callback();
    }
  }
};