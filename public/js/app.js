karhu.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.use(Sammy.NestedParams);
  this.use(Sammy.JSON);
  
  this.element_selector = 'body';
  this.cache_partials = false;
  
  this.helpers(ApplicationHelper);
  this.helpers({ store: config.store });
  
  karhu.Categories(this);

  this.swap = function(content) {
    return $('.main').html(content);
  },
  
  this.get('#/', function(context) {
    context.redirect('#/categories');
  });
  
  this.bind('init', function() { with(this) {
    this.configure_facebox();
  }});  
});
 
$(function() {
  karhu.app.run('#/');
  karhu.app.trigger('init');
});