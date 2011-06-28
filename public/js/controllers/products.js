karhu.Products = function(app) {
  app.get('#/products', function(context) {
    karhu.Product.all(context.params, function(products) {
      context.render('templates/products/index.mustache', {products: products}).replace('.tableView');
      context.renderAddButton('products', 'product', 'category');
      context.clearMain();
    });
  });
  
  app.get('#/products/new', function(context) {
    context.handleLastAccess(null, 'last_added_product', function(last_added_product) {
      karhu.backend.get('/categories', {}, function(categories) {
        context.objectForValidation = new karhu.Product();
        context.partial('templates/products/new.mustache', new karhu.EditProduct({}, categories, last_added_product));
      });      
    });
  });
  
  app.post('#/products', function(context) {
    context.store.clear('last_added_product');
    
    var product = new karhu.Product(context.params.product);
    product.save(function() {
      context.flash('product_successfully_created');
      context.redirect('#/products');      
    }, function() {
      context.flash('not_able_to_create_product');
    });
  });

  app.get('#/products/:id/edit', function(context) {
    context.handleLastAccess(context.params, 'last_edited_product', function(last_edited_product) {
      karhu.backend.get('/categories', {}, function(categories) {
        karhu.Product.find(context.params.id, function(product) {
          context.objectForValidation = new karhu.Product();
          context.partial('templates/products/edit.mustache', new karhu.EditProduct(product, categories, last_edited_product));
        });
      });      
    });
  });
  
  app.put('#/products/:id', function(context) {
    context.store.clear('last_edited_product');
    
    var product = new karhu.Product(context.params.product);
    product.save(function() {
      context.flash('product_successfully_updated');
      context.redirect('#/products');
    }, function() {
      context.flash('not_able_to_update_product');    
    });
  });
    
  app.del('#/products/:id', function(context) {
    var product = new karhu.Product({id: context.params.id});
    product.destroy(function() {
      context.flash('product_successfully_deleted');
      context.redirect('#/products');      
    }, function() {
      context.flash('not_able_to_delete_product');
    });
  });
};