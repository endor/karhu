karhu.Base = function() {
  this.save = function(success, error) {
    if(this.id) {
      karhu.backend.put(this.url + '/' + this.id, this.toJSON(), success, error);
    } else {
      karhu.backend.post(this.url, this.toJSON(), success, error);
    }
  };
  
  this.destroy = function(success, error) {
    karhu.backend.del(this.url + '/' + this.id, {}, success, error);
  };
  
  this.buildQueryParams = function(params, name) {
    var result = {
      page: params.page || 1,
      per_page: karhu.config.per_page || 10
    };
    
    this.handleFilter(result, params);
    this.handleSort(result, params, name);

    return result;
  };
  
  this.handleFilter = function(result, params) {
    result.filter = params.search || karhu.store.get('filter');
    if(result.filter && params.search !== "") {
      karhu.store.set('filter', result.filter);
      $('.search input').val(result.filter);
    } else {
      delete result.filter;
      karhu.store.clear('filter');
    }
  };
  
  this.handleSort = function(result, params, type) {
    result.sort = params.sort || karhu.store.get('sort' + type);
    result.reverse = params.reverse || karhu.store.get('reverse' + type);

    if((params.sort && !params.reverse) || !result.reverse) {
      karhu.store.clear('reverse' + type);
      delete result.reverse;
      karhu.reverse = false;
    }

    if(result.sort) {
      karhu.sort = result.sort;
      karhu.store.set('sort' + type, result.sort);

      if(result.reverse) {
        karhu.reverse = true;
        karhu.store.set('reverse' + type, true);
        result.reverse = true;        
      }
    } else {
      delete result.sort;
    }
  };  
};