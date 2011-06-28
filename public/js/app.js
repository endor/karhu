$(function() {

  karhu.Application = Backbone.Router.extend({
    routes: {
      "/categories": "categories",
      "/products": "products",
      "/session/new": "newSession",
      "/:type/new": "newItem",
      "/:type/:id/edit": "editItem"
    },
    
    newSession: function() {
      new karhu.SessionView();
    },
    
    newItem: function(type) {
      if(!this.loggedIn()) { this.redirectToLogin(); return; }
      karhu.views.newItem.className = type;
      karhu.views.newItem.collection = karhu.Collections[type];
      karhu.views.newItem.render();
    },
    
    editItem: function(type, id) {
      if(!this.loggedIn()) { this.redirectToLogin(); return; }
      karhu.views.edit.className = type;
      karhu.views.edit.collection = karhu.Collections[type];
      karhu.views.edit.model = karhu.Collections[type].get(id);
      karhu.views.edit.render();
    },

    categories: function() {
      if(!this.loggedIn()) { this.redirectToLogin(); return; }

      karhu.Categories.fetch({
        success: this.renderViewWithCollection('categories', karhu.Categories)
      });
    },
    
    products: function() {
      if(!this.loggedIn()) { this.redirectToLogin(); return; }
      
      var context = this;
      karhu.Categories.fetch({
        success: function() {
          karhu.Products.fetch({
            success: context.renderViewWithCollection('products', karhu.Products)
          });
        }
      });
    },
    
    renderViewWithCollection: function(type, collection) {
      karhu.views.main.className = type;
      karhu.views.main.collection = collection;
      karhu.views.main.render();
    },
    
    loggedIn: function() {
      return !!Backbone.sync.token;
    },
    
    redirectToLogin: function() {
      window.location.href = "#/session/new";
    }
  });
  
  karhu.app = new karhu.Application();
  Backbone.history.start();

  window.location.href = "#/categories";

});