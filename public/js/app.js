karhu.app = $.sammy(function() {
  this.element_selector = 'body';
  this.cache_partials = false;

  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  this.use(Sammy.JSON);  
  
  this.helpers(karhu.ApplicationHelper);
  this.helpers(karhu.OfflineHelper);
  this.helpers(karhu.AccessLastItemHelper);
  this.helpers(karhu.CustomValidatorsHelper);
  this.helpers(karhu.LocalesHelper);
  this.helpers(karhu.AroundBeforeFilterHelper);
  this.helpers({ store: config.store });

  karhu.Categories(this);
  karhu.Products(this);
  karhu.CachedActions(this);
  karhu.Locales(this);
  karhu.Session(this);
  
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
  
  
  var event_context = this.context_prototype.prototype;
  
  this.before(event_context.clearContextVariables);
  this.before(event_context.markActiveMenuItem);
  this.before({only: {verb: ['post', 'put']}}, event_context.redirectIfCanceled);

  this.around(event_context.initializeLocales);
  this.around(event_context.redirectToLogin);
  this.around(event_context.redirectToLastAccessedItem);
});

$(function() {
  karhu.app.run('#/');
  karhu.app.trigger('init');
});