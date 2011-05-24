karhu.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  this.use(Sammy.JSON);
  
  this.element_selector = 'body';
  this.cache_partials = false;
  this.debug = true;
  
  this.helpers(karhu.ApplicationHelper);
  this.helpers(karhu.OfflineHelper);
  this.helpers({ store: config.store });
  
  karhu.Categories(this);
  karhu.Products(this);
  
  this.swap = function(content) {
    var context = this,
      event_content = context.context_prototype.prototype,
      result = $('.main').html(content),
      fns = [
        'beautifyInputElements',
        'adjustElementsToOnlineStatus',
        'syncQueue'
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
  });
  
  this.before(function(context) {
    var type = context.path.match(/\#\/(\w+)/);
    if(type) {
      $('#header nav a').removeClass('active');
      $('#header nav .' + type[1]).addClass('active');
    }
  });
  
  this.around(function(callback) {
    var last_edited_product = this.store.get('last_edited_product');
    if(last_edited_product && !this.path.match(new RegExp('\\/products\\/' + last_edited_product))) {
      this.flash('Please finnish editing your product.');
      this.redirect('#/products/' + last_edited_product + '/edit');
    } else {
      callback();
    }
  }); 
});
 
$(function() {
  karhu.app.run('#/');
  karhu.app.trigger('init');
});