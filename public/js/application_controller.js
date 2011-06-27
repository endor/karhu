$(function() {

  karhu.Application = Backbone.Router.extend({
    routes: {
      "/categories": "categories",
      "/products": "products",
      "/:type/new": "newItem",
      "/:type/:id/edit": "editItem"
    },
    
    newItem: function(type) {
      karhu.views.newItem.className = type;
      karhu.views.newItem.collection = karhu.Collections[type];
      karhu.views.newItem.render();
    },
    
    editItem: function(type, id) {
      karhu.views.edit.className = type;
      karhu.views.edit.collection = karhu.Collections[type];
      karhu.views.edit.model = karhu.Collections[type].get(id);
      karhu.views.edit.render();
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
  karhu.views.newItem = new karhu.NewView();
  karhu.views.edit = new karhu.EditView();
  
  new karhu.Application();
  Backbone.history.start();
  
});