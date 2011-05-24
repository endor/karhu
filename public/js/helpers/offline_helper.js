karhu.OfflineHelper = {

  stateChangedToOffline: function() {
    if(!karhu.offline) {
      karhu.offline = true;
      this.flash("You are currently offline.");
      $('.delete_form').hide();
    }
  },
  
  stateChangedToOnline: function() {
    if(karhu.offline) {
      karhu.offline = false;
      this.flash("You are currently online.");
      $('.delete_form').show();
      this.syncQueue();
    }
  },
  
  syncQueue: function() {
    var queue = this.store.get('queue') || [],
      context = this;

    this.store.clear('queue');

    queue.forEach(function(action) {
      context['ajax_' + action.verb].call(context, action.url, action.data, function() {});
    });
  },
  
  storeInQueue: function(verb, data, url) {
    var queue = this.store.get('queue') || [];
    queue.push({verb: verb, data: data, url: url});
    this.store.set('queue', queue);    
  },
  
  addToCachedObjects: function(data, url) {
    var objects = this.store.get('get' + url);
    objects.push(data);
    this.store.set('get' + url, objects);
  },
  
  updateCachedObjects: function(data, url) {
    var match = url.match(/(\/\w+)\/(\d+)/),
      objects = this.store.get('get' + match[1]),
      id = match[2];
    
    _.extend(_.find(objects, function(object) {
      return parseInt(object.id, 10) === parseInt(id, 10);
    }), data);

    this.store.set('get' + match[1], objects);    
  },
  
  retrieveObjectFromCachedList: function(url) {
    var match = url.match(/(\/\w+)\/(\d+)/);

    return _.find(this.store.get('get' + match[1]), function(object) {
      return parseInt(object.id, 10) === parseInt(match[2], 10);
    });    
  },
  
  saveRequestInQueue: function(verb, data, url, success, callback) {
    if(verb !== 'get') { this.storeInQueue(verb, data, url); }
    if(verb === 'post') { this.addToCachedObjects(data, url); }
    if(verb === 'put') { this.updateCachedObjects(data, url); }
    
    if(verb === 'get' && url.match(/\/\w+\/\d+/)) {
      success(this.retrieveObjectFromCachedList(url));
    } else {
      success(this.store.get(verb + url));
    }
    
    if(callback) { callback(); }
  },
  
  notifyOfOnlineOfflineStatus: function() {
    var context = this;
    $(window).bind("online offline", function() {
      if(navigator.onLine) {
        context.stateChangedToOnline();
      } else {
        context.stateChangedToOffline();
      }
    });
  },
  
  adjustElementsToOnlineStatus: function() {
    if(karhu.offline) {
      $('.delete_form').hide();
    }
  },
  
  cachePartials: function() {
    var context = this;
    
    ['categories', 'products'].forEach(function(type) {
      ['new', 'edit', 'index'].forEach(function(partial) {
        context.load('templates/' + type + '/' + partial + '.mustache', {cache: true});
      });
    });
  }
  
};