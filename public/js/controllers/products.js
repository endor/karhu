karhu.Products = function(app) {
  app.get('#/products', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.ajax_get('/products', {}, function(products) {
        products = products.map(function(product) { return new karhu.Product(product, categories); });
        context.partial('templates/products/index.mustache', {products: products});
      })      
    });
  });
};