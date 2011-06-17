karhu.Categories = function(app) {
  app.get('#/categories', function(context) {
    karhu.Category.all(context.params, function(categories) {
      context.partial('templates/categories/index.mustache', {categories: categories});
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
    
    var category = new karhu.Category(context.params.category);
    category.save(function() {
      context.flash('category_successfully_created');
      context.redirect('#/categories');
    }, function() {
      context.flash('not_able_to_create_category');      
    });    
  });

  app.get('#/categories/:id/edit', function(context) {
    context.handleLastAccess(context.params, 'last_edited_category', function(last_edited_category) {
      karhu.Category.find(context.params.id, function(category) {
        context.objectForValidation = new karhu.Category();
        context.partial('templates/categories/edit.mustache', new karhu.EditCategory(category, last_edited_category));
      });
    });
  });
  
  app.put('#/categories/:id', function(context) {
    context.store.clear('last_edited_category');
    
    var category = new karhu.Category(context.params.category);
    category.save(function() {
      context.flash('category_successfully_updated');
      context.redirect('#/categories');
    }, function() {
      context.flash('not_able_to_update_category');
    });
  });
    
  app.del('#/categories/:id', function(context) {
    var category = new karhu.Category({id: context.params.id});
    category.destroy(function() {
      context.flash('category_successfully_deleted');
      context.redirect('#/categories');      
    }, function() {
      context.flash('not_able_to_delete_category');
    });
  });
};