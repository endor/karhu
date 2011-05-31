karhu.Products = function(app) {
  app.get('#/products', function(context) {
    var params = {
      page: context.params.page || 1,
      per_page: karhu.config.per_page || 10
    };
    
    if(context.params.sort) {
      params.sort = context.params.sort;
    }
    
    context.ajax_get('/categories', {}, function(categories) {
      context.ajax_get('/products', params, function(paginated_products) {
        context.objectForPagination = _.extend({}, paginated_products, {url: '#/products'});      
        products = paginated_products.values.map(function(product) { return new karhu.Product(product, categories); });
        context.partial('templates/products/index.mustache', {products: products});
      });
    });
  });
  
  app.get('#/products/new', function(context) {
    context.handleLastAccess(null, 'last_added_product', function(last_added_product) {
      context.ajax_get('/categories', {}, function(categories) {
        context.objectForValidation = new karhu.Product();
        context.partial('templates/products/new.mustache', new karhu.EditProduct({}, categories, last_added_product));
      });      
    });
  });
  
  app.post('#/products', function(context) {
    context.store.clear('last_added_product');
    context.ajax_post('/products', new karhu.Product(context.params.product).toJSON(), function() {
      context.flash('product_successfully_created');
      context.redirect('#/products');      
    }, function() {
      context.flash('not_able_to_create_product');
    });
  });

  app.get('#/products/:id/edit', function(context) {
    context.handleLastAccess(context.params, 'last_edited_product', function(last_edited_product) {
      context.ajax_get('/categories', {}, function(categories) {
        context.ajax_get('/products/' + context.params.id, {}, function(product) {
          context.objectForValidation = new karhu.Product();
          context.partial('templates/products/edit.mustache', new karhu.EditProduct(product, categories, last_edited_product));
        });
      });      
    });
  });
  
  app.put('#/products/:id', function(context) {
    context.store.clear('last_edited_product');
    context.ajax_put('/products/' + context.params.id, new karhu.Product(context.params.product).toJSON(), function() {
      context.flash('product_successfully_updated');
      context.redirect('#/products');
    }, function() {
      context.flash('not_able_to_update_product');    
    });
  });
    
  app.del('#/products/:id', function(context) {
    context.ajax_delete('/products/' + context.params.id, {}, function() {
      context.flash('product_successfully_deleted');
      context.redirect('#/products');      
    }, function() {
      context.flash('not_able_to_delete_product');
    });
  });
};