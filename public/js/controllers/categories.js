karhu.Categories = function(app) {
  app.get('#/categories', function(context) {
    context.ajax_get('/categories', {}, function(categories) {
      context.partial('templates/categories/index.mustache', {categories: categories});
    });
  });
  
  app.get('#/categories/new', function(context) {
    context.handleLastAccess(null, 'last_added_category', function(last_added_category) {
      context.render('templates/categories/new.mustache', new karhu.EditCategory({}, last_added_category), function(content) {
        context.swap(content);
        context.validate('Category');
      });
    });
  });
  
  app.post('#/categories', function(context) {
    context.store.clear('last_added_category');
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
    context.handleLastAccess(context.params, 'last_edited_category', function(last_edited_category) {
      context.ajax_get('/categories/' + context.params.id, {}, function(category) {
        context.partial('templates/categories/edit.mustache', new karhu.EditCategory(category, last_edited_category));
      });
    });
  });
  
  app.put('#/categories/:id', function(context) {
    context.store.clear('last_edited_category');
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