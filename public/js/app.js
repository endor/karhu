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
      var view = new karhu.MainView({className: models, collection: collection});
      collection.fetch({
        success: function() { view.render(); }
      });      
    },
    
    index: function() {
    }
  });
  
  karhu.Categories = new karhu.CategoryCollection();
  karhu.Products = new karhu.ProductCollection();
  
  new karhu.Application();
  Backbone.history.start();

});