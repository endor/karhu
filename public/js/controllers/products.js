karhu.Products = function(app) {
  app.get('#/products', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.ajax_get('/products', {}, function(products) {
        products = products.map(function(product) { return new karhu.Product(product, categories); });
        context.partial('templates/products/index.mustache', {products: products});
      });
    });
  });
  
  app.get('#/products/new', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.partial('templates/products/new.mustache', {categories: categories});
    });
  });
  
  app.post('#/products', function(context) {
    context.ajax_post('/products', context.params.product, function() {
      context.flash(context.params.product.name + ' successfully created.');
      context.redirect('#/products');      
    }, function() {
      context.flash('Not able to create ' + context.params.product.name);      
    });
  });
  
  app.del('#/products/:id', function(context) {
    context.ajax_delete('/products/' + context.params.id, {}, function() {
      context.flash(context.params.name + ' successfully deleted.');
      context.redirect('#/products');      
    }, function(a, b, c) {
      context.flash('Not able to delete ' + context.params.name);
    });
  });
};