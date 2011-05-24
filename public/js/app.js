karhu.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  this.use(Sammy.JSON);
  
  this.element_selector = 'body';
  this.cache_partials = false;
  this.debug = true;
  
  this.helpers(karhu.ApplicationHelper);
  this.helpers(karhu.OfflineHelper);
  this.helpers(karhu.AccessLastItemHelper);
  this.helpers({ store: config.store });
  
  karhu.Categories(this);
  karhu.Products(this);
  
  this.swap = function(content) {
    var context = this,
      event_content = context.context_prototype.prototype,
      result = $('.main').html(content),
      fns = [
        'beautifyInputElements',
        'adjustElementsToOnlineStatus'
      ];
      
    fns.forEach(function(fn) {
      event_content[fn].call(event_content, context);
    });

    return result;
  };
  
  this.get('#/', function(context) {
    context.redirect('#/products');
  });
  
  this.bind('init', function() {
    this.configureFacebox();
    this.notifyOfOnlineOfflineStatus();
    this.cachePartials();
    this.prepareCancelButtons();
    this.prepareInputFields();
  });
  
  this.before(function(context) {
    var type = context.path.match(/\#\/(\w+)/);
    if(type) {
      $('#header nav a').removeClass('active');
      $('#header nav .' + type[1]).addClass('active');
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