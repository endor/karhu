karhu.OfflineHelper = {
  stateChangedToOffline: function() {
    if(!karhu.offline) {
      karhu.offline = true;
      this.flash("You are currently offline.");
      $('.delete_form').hide();
    }
  },
  
  stateChangedToOnline: function() {
    this.flash("Hallelujah");
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

    this.flash('syncing queue');

    queue.forEach(function(action) {
      context['ajax_' + action.verb].call(context, action.url, action.data, function() {});
    });
  },
  
  saveRequestInQueue: function(verb, data, url, success, callback) {
    if(verb !== 'get') {
      var queue = this.store.get('queue') || [];
      queue.push({verb: verb, data: data, url: url});
      this.store.set('queue', queue);
      
      if(verb === 'post') {
        var objects = this.store.get('get' + url);
        objects.push(data);
        this.store.set('get' + url, objects);
      }
    }
    
    success(this.store.get(verb + url));
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
  
  /*
   *
   * TODO: in the future we might want to replace this with a cache manifest.
   *   see:
   *     http://diveintohtml5.org/offline.html
   *     http://spin.atomicobject.com/2011/04/29/automated-tests-for-html5-offline-web-applications-with-capybara-and-selenium/
   *
   */
  cachePartials: function() {
    var context = this;
    
    ['categories', 'products'].forEach(function(type) {
      ['new', 'edit', 'index'].forEach(function(partial) {
        context.load('templates/' + type + '/' + partial + '.mustache', {cache: true});
      });
    });
  }
  
};