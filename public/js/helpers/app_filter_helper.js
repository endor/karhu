karhu.AppFilterHelper = {
  updateContextVariables: function(callback) {
    this.objectForValidation = null;
    karhu.backend = new karhu.Backend(this);
    karhu.store = this.store;
    callback();
  },
  
  markActiveMenuItem: function(context) {
    var type = context.path.match(/\#\/([^\/\?]+)/);
    if(type && type[1] !== 'pages') {
      var clazz;
      switch(type[1]) {
        case 'products': clazz = 'productView'; break;
        case 'categories': clazz = 'categoryView'; break;
        case 'queue': clazz = 'queueView'; break;
      }
      $('body').removeClass('productView categoryView queueView');
      $('body').addClass(clazz);
    }
  },
  
  changeSearchField: function(context) {
    var $search = $('.search');
    if(context.path.match(/\#\/products([^\/]+)?$/)) {
      $search.show();
      $search.find('form').attr('action', '#/products');
    } else if(context.path.match(/\#\/categories([^\/]+)?$/)) {
      $search.show();
      $search.find('form').attr('action', '#/categories');      
    } else {
      $search.hide();
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