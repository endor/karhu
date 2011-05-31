karhu.Categories = function(app) {
  app.get('#/categories', function(context) {
    var params = {
      page: context.params.page || 1,
      per_page: karhu.config.per_page || 10
    };
    
    if(context.params.sort) {
      params.sort = context.params.sort;
    }

    context.ajax_get('/categories', params, function(paginated_categories) {
      context.objectForPagination = _.extend({}, paginated_categories, {url: '#/categories'});      
      context.partial('templates/categories/index.mustache', {categories: paginated_categories.values});
    });
  });
  
  app.get('#/categories/new', function(context) {
    context.handleLastAccess(null, 'last_added_category', function(last_added_category) {
      context.objectForValidation = new karhu.Category();
      context.partial('templates/categories/new.mustache', new karhu.EditCategory({}, last_added_category));
    });
  });
  
  app.post('#/categories', function(context) {
    context.store.clear('last_added_category');
    context.ajax_post('/categories', context.params.category, function() {
      context.flash('category_successfully_created');
      context.redirect('#/categories');
    }, function() {
      context.flash('not_able_to_create_category');
    });
  });

  app.get('#/categories/:id/edit', function(context) {
    context.handleLastAccess(context.params, 'last_edited_category', function(last_edited_category) {
      context.ajax_get('/categories/' + context.params.id, {}, function(category) {
        context.objectForValidation = new karhu.Category();
        context.partial('templates/categories/edit.mustache', new karhu.EditCategory(category, last_edited_category));
      });
    });
  });
  
  app.put('#/categories/:id', function(context) {
    context.store.clear('last_edited_category');
    context.ajax_put('/categories/' + context.params.id, context.params.category, function() {
      context.flash('category_successfully_updated');
      context.redirect('#/categories');
    }, function() {
      context.flash('not_able_to_update_category');
    });
  });
    
  app.del('#/categories/:id', function(context) {
    context.ajax_delete('/categories/' + context.params.id, {}, function() {
      context.flash('category_successfully_deleted');
      context.redirect('#/categories');      
    }, function() {
      context.flash('not_able_to_delete_category');
    });
  });
};