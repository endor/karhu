karhu.CacheHelper = {
  runOnlineQueue: function() {
    var queue = this.store.get('onlineQueue') || [],
      cachedLists = new karhu.CachedLists(this.store);

    queue.forEach(function(action) {
      cachedLists.process(action);
    });
    
    this.store.clear('onlineQueue');
  },
  
  runOfflineQueue: function() {
    var queue = this.store.get('offlineQueue') || [],
      context = this;

    queue.forEach(function(action) {
      context['ajax_' + action.verb].call(context, action.url, action.data, function() {});
    });

    this.store.clear('offlineQueue');
  },

  storeInQueue: function(queue_name, verb, data, url) {
    if(verb !== 'get') {
      var queue = this.store.get(queue_name) || [];
      queue.push({verb: verb, data: data, url: url});
      this.store.set(queue_name, queue);
    }
  },

  storeInOnlineQueue: function(verb, data, url) {
    if(_.isString(data)) { data = JSON.parse(data); }
    
    this.storeInQueue('onlineQueue', verb, data, url);

    if(this.app.objects_cached) {
      this.runOnlineQueue();
    }
  },
  
  storeInOfflineQueue: function(verb, data, url, success) {
    this.storeInQueue('offlineQueue', verb, data, url);

    var action = {data: data, url: url, verb: verb};
    var cachedLists = new karhu.CachedLists(this.store);

    if(verb !== 'get') {
      cachedLists.process(action);
      success();
    } else {
      var result = cachedLists.retrieve(action, this);
      success(result);
    }
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
      context.ajax_get('/' + type, {}, function(objects) {
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