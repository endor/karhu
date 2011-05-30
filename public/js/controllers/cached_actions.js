karhu.CachedActions = function(app) {
  app.get('#/cached-actions', function(context) {
    if(!karhu.offline) { context.redirect('#/'); }
    context.partial('templates/cached_actions/index.mustache', new karhu.Queue(this.store.get('offlineQueue')));
  });
};