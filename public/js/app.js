karhu.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  this.use(Sammy.JSON);
  
  this.element_selector = 'body';
  this.cache_partials = false;
  
  this.helpers(karhu.ApplicationHelper);
  this.helpers(karhu.OfflineHelper);
  this.helpers(karhu.AccessLastItemHelper);
  this.helpers(karhu.CustomValidatorsHelper);
  this.helpers(karhu.LocalesHelper);
  this.helpers({ store: config.store });
  
  karhu.Categories(this);
  karhu.Products(this);
  karhu.CachedActions(this);
  karhu.Locales(this);
  
  //
  // NOTE: for this to work sammy needs to send the event context to swap
  //
  //   swap: function(contents) {
  //     return this.app.swap(contents, this);
  //   },
  //
  this.swap = function(content, context) {
    var result = $('.main').html(content);

    context.beautifyInputElements();
    context.adjustElementsToOnlineStatus();
    if(context.objectForValidation) {
      var validations = context.objectForValidation.validations();
      $('.main form').validate(context.translateValidationMessages(validations));
    }
    
    return result;
  };
  
  this.get('#/', function(context) {
    context.redirect('#/products');
  });
  
  this.bind('init', function() {
    this.notifyOfOnlineOfflineStatus();
    this.cachePartials();
    this.prepareCancelButtons();
    this.prepareInputFields();
    this.initializeCustomValidators();
    this.initializeLocales();
  });
  
  this.before(function(context) {
    context.objectForValidation = null;
  });
  
  this.before(function(context) {
    var type = context.path.match(/\#\/([^\/]+)/);
    if(type) {
      $('#header nav a').removeClass('active');
      $('#header nav .' + type[1]).addClass('active');
    }
  });
  
  this.before({only: {verb: ['post', 'put']}}, function(context) {
    if(context.params.cancel) {
      var toClear = ['last_added_product', 'last_edited_product', 'last_added_category', 'last_edited_category'];
      toClear.forEach(function(item) { context.store.clear(item); });      
      var redirect_path = context.path.match(/(\#\/[^\/]+)/)[1];
      context.redirect(redirect_path);
      return false;
    }
  });
  
  this.around(function(callback) {
    var key = _.find(this.store.keys(), function(key) { return key.match(/last\_(edited|added)/); });

    if(key) {
      this.accessLastItem(key, callback);
    } else {
      callback();
    }
  }); 
});

$(function() {
  karhu.app.run('#/');
  karhu.app.trigger('init');
});