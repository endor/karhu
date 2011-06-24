$(function() {

  karhu.Application = Backbone.Router.extend({
    routes: {
      "/categories": "categories",
      "/products": "products",
      "/:type/new": "newItem"
    },
    
    newItem: function(type) {
      new karhu.EditView({className: type, collection: karhu.Collections[type]});
    },

    categories: function() {
      this.renderViewWithCollection('categories', karhu.Categories);
    },
    
    products: function() {
      this.renderViewWithCollection('products', karhu.Products);
    },
    
    renderViewWithCollection: function(type, collection) {
      collection.fetch({
        success: function() { karhu.views.main = new karhu.MainView({className: type, collection: collection}); }
      });
    }
  });
  
  karhu.views.top = new karhu.TopView();
  
  new karhu.Application();
  Backbone.history.start();
  
});