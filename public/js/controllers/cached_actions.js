karhu.CachedActions = function(app) {
  app.get('#/cached-actions', function(context) {
    if(!karhu.offline) { context.redirect('#/'); }
    
    karhu.backend.get('#/categories', {}, function(categories) {
      var queue = new karhu.Queue('offline', context.store);
      context.render('templates/cached_actions/index.mustache', queue.render(categories)).replace('.tableView');
      context.clearAddButton();
      context.clearMain();
    });
  });
};