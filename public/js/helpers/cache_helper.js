karhu.CacheHelper = {
  addToCachedObjects: function(action) {
    var objects = this.store.get(action.url);
    objects.push(action.data);
    this.store.set(action.url, objects);
  },
  
  updateCachedObjects: function(action) {
    var match = action.url.match(/(\/\w+)\/(\d+)/),
      objects = this.store.get(match[1]),
      id = match[2];
    
    _.extend(_.find(objects, function(object) {
      return parseInt(object.id, 10) === parseInt(id, 10);
    }), action.data);

    this.store.set(match[1], objects);
  },
  
  deleteFromCachedObjects: function(action) {
    var match = action.url.match(/(\/\w+)\/(\d+)/),
      objects = this.store.get(match[1]),
      id = match[2];
    
    objects = _.reject(objects, function(object) {
      return parseInt(object.id, 10) === parseInt(id, 10);
    });

    this.store.set(match[1], objects);
  },
  
  retrieveObjectFromCachedList: function(url) {
    var match = url.match(/(\/\w+)\/(\d+)/),
      objects = this.store.get(match[1]);
    
    return _.find(objects, function(object) {
      return parseInt(object.id, 10) === parseInt(match[2], 10);
    });    
  },
  
  retrieveCachedList: function(url) {
    return this.store.get(url);
  },
  
  runOnlineQueue: function() {
    var queue = this.store.get('onlineQueue') || [],
      context = this;

    queue.forEach(function(action) {
      switch(action.verb) {
        case 'post':
          context.addToCachedObjects(action);
          break;
        case 'put':
          context.updateCachedObjects(action);
          break;
        case 'delete':
          context.deleteFromCachedObjects(action);
          break;
      }
    });
    
    this.store.clear('onlineQueue');
  },
  
  runOfflineQueue: function() {
    var queue = this.store.get('offlineQueue') || [],
      context = this;

    this.store.clear('offlineQueue');

    queue.forEach(function(action) {
      context['ajax_' + action.verb].call(context, action.url, action.data, function() {});
    });
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
    
    var action = {data: data, url: url};
    
    switch(verb) {
      case 'post':
        this.addToCachedObjects(action);
        success();
        break;
      case 'put':
        this.updateCachedObjects(action);
        success();
        break;
      case 'get':
        if(url.match(/\/\w+\/\d+/)) {
          success(this.retrieveObjectFromCachedList(url));
        } else {
          var list = this.retrieveCachedList(url);
          if(data.sort) { list = this.sortList(list, data.sort, data.reverse); }
          if(data.page) { list = this.paginateList(list, url, data.page, data.per_page); }
          success(list);
        }
        break;
      default:
        success();
        break;
    }
  },
  
  clearStore: function() {
    var context = this;
    ['onlineQueue', 'offlineQueue', 'sortCategories', 'sortProducts'].forEach(function(key) {
      context.store.clear(key);
    });
  },
  
  paginateList: function(list, url, page, per_page) {
    page = page || 1;
    per_page = per_page || karhu.config.per_page;

    return {
      current_page: page,
      total_pages: Math.ceil(list.length / per_page),
      total_entries: list.length,
      per_page: per_page,
      values: list.splice((page - 1) * per_page, per_page),
      url: '#' + url
    };
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