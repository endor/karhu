$(function() {
  
  karhu.Application = Backbone.Controller.extend({
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
        success: function() { new karhu.MainView({className: type, collection: collection}); }
      });
    }
  });
  
  karhu.Categories = new karhu.CategoryCollection();
  karhu.Products = new karhu.ProductCollection();
  karhu.Collections = {
    categories: karhu.Categories,
    products: karhu.Products
  };
  
  new karhu.I18n(store);
  
  new karhu.Application();
  Backbone.history.start();
  
});