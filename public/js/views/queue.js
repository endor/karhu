karhu.Queue = function(queue_name, store, context) {
  this.cached_actions = store.get(queue_name + 'Queue') || [];

  this.store = function(verb, data, url, success) {
    if(_.isString(data)) { data = JSON.parse(data); }
    storeInStore(this.cached_actions, verb, data, url);

    if(queue_name === 'online') {
      if(context.app.objects_cached) { this.run(); }
    }
    
    if(queue_name === 'offline') {
      var action, cachedLists, result;
      
      action = {data: data, url: url, verb: verb};
      cachedLists = new karhu.CachedLists(store);

      if(verb !== 'get') {
        cachedLists.process(action);
        success();
      } else {
        result = cachedLists.retrieve(action, context);
        success(result);
      }
    }    
  };
  
  this.run = function() {
    var callback;
    
    if(queue_name === 'offline') {
      callback = function(action) { makeRequest(action); };
    } else {
      var cachedLists = new karhu.CachedLists(store);
      callback = function(action) { cachedLists.process(action); };
    }

    this.cached_actions.forEach(callback);

    store.clear(queue_name + 'Queue');
  };

  this.render = function(categories) {
    this.cached_actions.forEach(function(action) {      
      addHumanReadableSummary(action);
      addHumanReadableAttributes(action, categories);
    });

    return {cached_actions: this.cached_actions};
  };
  
  
  function makeReadable(attr) {
    if(attr === "category_id") { attr = "category"; }
    if(attr === "unit_price") { attr = "price"; }
    return $.global.localize("karhu")[attr];
  }
  
  function addHumanReadableSummary(action) {
    var verb = action.verb === 'post' ? 'Created' : 'Updated',
      type = action.url.match(/products/) ? 'Product' : 'Category';

    action.humanReadableSummary = verb + ' ' + type + ' ' + action.data.name;
  }
  
  function addHumanReadableAttributes(action, categories) {
    var attributes = [];

    ['name', 'description', 'unit_price', 'valid_to'].forEach(function(attr) {
      if(action.data[attr]) {
        attributes.push(makeReadable(attr) + ': ' + action.data[attr]);
      }
    });

    if(action.data.category_id && categories) {
      attributes.push(makeReadable('category_id') + ': ' + categoryNameFromId(action.data.category_id, categories));
    }

    action.humanReadableAttributes = attributes.join(', ');
  }
  
  function categoryNameFromId(category_id, categories) {
    return _.find(categories, function(category) {
      return parseInt(category.id, 10) === parseInt(category_id, 10);
    }).name;    
  }

  function makeRequest(action) {
    if(action.verb === 'delete') { action.verb = 'del'; }
    context[action.verb].call(context, action.url, action.data, function() {});
  }
  
  function storeInStore(cached_actions, verb, data, url) {
    if(verb !== 'get') {
      cached_actions.push({verb: verb, data: data, url: url});
      store.set(queue_name + 'Queue', cached_actions);
    }    
  }
};