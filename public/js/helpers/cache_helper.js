karhu.CacheHelper = {
  runOnlineQueue: function() {
    var queue = new karhu.Queue('online', this.store, this);
    queue.run();
  },
  
  runOfflineQueue: function() {
    var queue = new karhu.Queue('offline', this.store, this);
    queue.run();
  },

  storeInOnlineQueue: function(verb, data, url) {
    var queue = new karhu.Queue('online', this.store, this);
    queue.store(verb, data, url);
  },
  
  storeInOfflineQueue: function(verb, data, url, success) {
    var queue = new karhu.Queue('offline', this.store, this);
    queue.store(verb, data, url, success);
  },
  
  clearStore: function() {
    var context = this;
    ['onlineQueue', 'offlineQueue', 'sortCategories', 'sortProducts'].forEach(function(key) {
      context.store.clear(key);
    });
  }  
};

(function() {

  var objectTypes = ['categories', 'products'];
  
  karhu.CacheHelper.cachePartials = function() {
    var context = this;
    
    objectTypes.forEach(function(type) {
      ['new', 'edit', 'index'].forEach(function(partial) {
        context.load('templates/' + type + '/' + partial + '.mustache', {cache: true});
      });
    });
    context.load('templates/cached_actions/index.mustache', {cache: true});
    context.load('templates/session/new.mustache', {cache: true});
    context.load('templates/shared/pagination_link.mustache', {cache: true});
  };
  
  karhu.CacheHelper.cacheObjects = function() {
    var objectTypesToCache = objectTypes.length,
      context = this;

    objectTypes.forEach(function(type) {
      context.get('/' + type, {}, function(objects) {
        context.store.set('/' + type, objects);
        objectTypesToCache -= 1;
        if(objectTypesToCache === 0) {
          context.app.objects_cached = true;
          context.runOnlineQueue();
        }        
      });
    });
  };
  
})();