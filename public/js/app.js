$(function() {
  
  karhu.Application = Backbone.Controller.extend({
    routes: {
      "": "index",
      "/categories": "categories",
      "/products": "products"
    },

    categories: function() {
      this.renderViewWithCollection('categories', karhu.Categories);
    },
    
    products: function() {
      this.renderViewWithCollection('products', karhu.Products);
    },
    
    renderViewWithCollection: function(models, collection) {
      collection.fetch({
        success: function() { new karhu.MainView({className: models, collection: collection}); }
      });
    },
    
    index: function() {
    }
  });
  
  karhu.Categories = new karhu.CategoryCollection();
  karhu.Products = new karhu.ProductCollection();
  
  new karhu.I18n(store);
  
  new karhu.Application();
  Backbone.history.start();

});