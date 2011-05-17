karhu.Categories = function(app) {
  app.get('#/categories', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.partial('templates/categories/index.mustache', {categories: categories});
    });
  });
};