karhu.Categories = function(app) {
  app.get('#/categories', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.partial('templates/categories/index.mustache', {categories: categories});
    });
  });
  
  app.get('#/categories/new', function(context) {
    context.partial('templates/categories/new.mustache');
  });
  
  app.post('#/categories', function(context) {
    context.handleCancel(context.params.cancel, '#/categories', function() {
      context.ajax_post('/categories', context.params.category, function() {
        context.flash(context.params.category.name + ' successfully created.');
        context.redirect('#/categories');
      }, function() {
        context.flash('Not able to create ' + context.params.category.name);
      });
    });
  });

  app.get('#/categories/:id/edit', function(context) {
    context.ajax_get('/categories/' + context.params.id, {}, function(category) {
      context.partial('templates/categories/edit.mustache', category);
    });
  });
  
  app.put('#/categories/:id', function(context) {
    context.handleCancel(context.params.cancel, '#/categories', function() {
      context.ajax_put('/categories/' + context.params.id, context.params.category, function() {
        context.flash(context.params.category.name + ' successfully updated.');
        context.redirect('#/categories');
      }, function() {
        context.flash('Not able to update ' + context.params.category.name);      
      });
    });
  });
    
  app.del('#/categories/:id', function(context) {
    context.ajax_delete('/categories/' + context.params.id, {}, function() {
      context.flash(context.params.name + ' successfully deleted.');
      context.redirect('#/categories');      
    }, function() {
      context.flash('Not able to delete ' + context.params.name);
    });
  });
};