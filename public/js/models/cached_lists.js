karhu.CachedLists = function(store) {
  this.store = store;
  
  initialize(this);
  
  
  this.process = function(action) {
    this.data = action.data;
    this.url = action.url;

    switch(action.verb) {
      case 'post':
        addToList(this.store, this.url, this.data);
        break;
      case 'put':
        updateList(this.store, this.url, this.data);
        break;
      case 'delete':
        removeFromList(this.store, this.url);
        break;
    }    
  };
  
  this.retrieve = function(action, helpers) {
    this.url = action.url;
    this.data = action.data;
    
    if(this.url.match(/\/\w+\/\d+/)) {
      return retrieveObject(this.store, this.url);
    } else {
      var list = retrieveList(this.store, this.url);
      if(this.data.sort)   { list = _sort(list, this.data.sort, this.data.reverse, this.store); }
      if(this.data.filter) { list = _filter(list, this.data.filter); }
      if(this.data.page)   { list = _paginate(list, this.url, this.data.page, this.data.per_page); }
      return list;
    }
  };  
  
  
  function retrieveObject(store, url) {
    var url = splitURL(url),
      list = store.get(url.path);
    
    return _.find(list, function(object) {
      return parseInt(object.id, 10) === url.id;
    });    
  }

  function retrieveList(store, url) {
    return store.get(url);
  }
  
  function addToList(store, url, data) {
    var list = store.get(url);
    list.push(data);
    store.set(url, list);
  }
  
  function updateList(store, url, data) {
    var url = splitURL(url),
      list = store.get(url.path);

    _.extend(_.find(list, function(object) {
      return parseInt(object.id, 10) === url.id;
    }), data);

    store.set(url.path, list);
  }
  
  function removeFromList(store, url) {
    var url = splitURL(url),
      list = store.get(url.path);

    list = _.reject(list, function(object) {
      return parseInt(object.id, 10) === url.id;
    });

    store.set(url.path, list);
  }

  function splitURL(url) {
    var splitted_url = url.match(/(\/\w+)\/(\d+)/);
    return {path: splitted_url[1], id: parseInt(splitted_url[2], 10)};
  }
  
  function initialize(context) {
    var list;
    ['products', 'categories'].forEach(function(type) {
      list = context.store.get('/' + type) || [];
      context.store.set('/' + type, list);
    });    
  }
  
  function _paginate(list, url, page, per_page) {
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
  
  function _sort(list, sort_by, reverse, store) {
    var sort_function = function(a, b) {
      var a_sort_by = a[sort_by].toUpperCase();
      var b_sort_by = b[sort_by].toUpperCase();
      return (a_sort_by < b_sort_by) ? -1 : (a_sort_by > b_sort_by) ? 1 : 0;
    };

    if(sort_by === 'valid_to') {
      sort_function = function(a, b) {
        return Date.parse(a.valid_to).compareTo(Date.parse(b.valid_to));
      };
    }
    
    if(sort_by === 'category') {
      var categories = store.get('/categories');
      sort_function = function(a, b) {
        var a_category = _.find(categories, function(category) { return category.id === a.category_id; });
        var b_category = _.find(categories, function(category) { return category.id === b.category_id; });
        var a_sort_by = a_category.name.toUpperCase();
        var b_sort_by = b_category.name.toUpperCase();
        return (a_sort_by < b_sort_by) ? -1 : (a_sort_by > b_sort_by) ? 1 : 0;
      };
    }
    
    list.sort(sort_function);
  
    if(reverse) {
      list.reverse();
    }
  
    return list;
  }
  
  function _filter(list, filter_by) {
    return _.select(list, function(element) {
      return _.select(element, function(value, key) {
        if(_.isString(value)) {
          return value.toUpperCase().match(filter_by.toUpperCase());
        } else {
          return false;
        }
      }).length > 0;
    });
  }
};