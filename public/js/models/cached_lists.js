karhu.CachedLists = function(store) {
  this.store = store;

  this.initialize = function() {
    var context = this, list;
    ['products', 'categories'].forEach(function(type) {
      list = context.store.get('/' + type) || [];
      context.store.set('/' + type, list);
    });
  };
  
  this.initialize();
  
  this.splitURL = function() {
    var url = this.url.match(/(\/\w+)\/(\d+)/);
    return {path: url[1], id: parseInt(url[2], 10)};
  };
  
  this.addToList = function() {
    var list = this.store.get(this.url);
    list.push(this.data);
    this.store.set(this.url, list);
  };
  
  this.updateList = function() {
    var url = this.splitURL(),
      list = this.store.get(url.path);

    _.extend(_.find(list, function(object) {
      return parseInt(object.id, 10) === url.id;
    }), this.data);

    this.store.set(url.path, list);
  };
  
  this.removeFromList = function() {
    var url = this.splitURL(),
      list = this.store.get(url.path);

    list = _.reject(list, function(object) {
      return parseInt(object.id, 10) === url.id;
    });

    this.store.set(url.path, list);
  };
  
  this.process = function(action) {
    this.data = action.data;
    this.url = action.url;

    switch(action.verb) {
      case 'post':
        this.addToList();
        break;
      case 'put':
        this.updateList();
        break;
      case 'delete':
        this.removeFromList();
        break;
    }    
  };
  
  var _paginate = function(list, url, page, per_page) {
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
  };
  
  var _sort = function(list, sort_by, reverse, store) {
    var sort_function = function(a, b) {
      var a_sort_by = a[sort_by].toUpperCase();
      var b_sort_by = b[sort_by].toUpperCase();
      return (a_sort_by < b_sort_by) ? -1 : (a_sort_by > b_sort_by) ? 1 : 0;
    };

    if(sort_by === 'valid_to') {
      sort_function = function(a, b) {
        return Date.parse(a.valid_to).compareTo(Date.parse(b.valid_to));
      }
    }
    
    if(sort_by === 'category') {
      var categories = store.get('/categories');
      sort_function = function(a, b) {
        var a_category = _.find(categories, function(category) { return category.id === a.category_id; });
        var b_category = _.find(categories, function(category) { return category.id === b.category_id; });
        var a_sort_by = a_category.name.toUpperCase();
        var b_sort_by = b_category.name.toUpperCase();
        return (a_sort_by < b_sort_by) ? -1 : (a_sort_by > b_sort_by) ? 1 : 0;
      }
    }
    
    list.sort(sort_function);
  
    if(reverse) {
      list.reverse();
    }
  
    return list;
  };
  
  this.retrieve = function(action, helpers) {
    this.url = action.url;
    this.data = action.data;
    
    if(this.url.match(/\/\w+\/\d+/)) {
      return this.retrieveObject();
    } else {
      var list = this.retrieveList();
      if(this.data.sort) { list = _sort(list, this.data.sort, this.data.reverse, this.store); }
      if(this.data.page) { list = _paginate(list, this.url, this.data.page, this.data.per_page); }
      return list;
    }
  };
  
  this.retrieveObject = function() {
    var url = this.splitURL(),
      list = this.store.get(url.path);
    
    return _.find(list, function(object) {
      return parseInt(object.id, 10) === url.id;
    });    
  };
  
  this.retrieveList = function() {
    return this.store.get(this.url);
  };  
};