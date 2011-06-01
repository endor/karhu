karhu.SortHelper = {
  sortList: function(list, sort_by, reverse) {
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
      var categories = this.store.get('/categories');
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
  },
  
  handleSort: function(params, context_params, type) {
    params.sort = context_params.sort || this.store.get('sort' + type);
    params.reverse = context_params.reverse || this.store.get('reverse' + type);

    if((context_params.sort && !context_params.reverse) || !params.reverse) {
      this.store.clear('reverse' + type);
      delete params.reverse;
      this.reverse = false;
    }

    if(params.sort) {
      this.sort = params.sort;
      this.store.set('sort' + type, params.sort);

      if(params.reverse) {
        this.reverse = true;
        this.store.set('reverse' + type, true);
        params.reverse = true;        
      }
    } else {
      delete params.sort;
    }
  },
  
  markSortColumn: function() {
    $('th, td').removeClass('selected');
    if(this.sort) {
      $('.' + this.sort + '_column').addClass('selected');
    }

    var link = $('a.reverse');
    if(link.length > 0) {
      link.attr('href', link.attr('data-link')).removeClass('reverse');
    }
    
    if(!this.reverse) {
      var link = $('th.' + this.sort + '_column a');
      link.attr('href', link.attr('href') + '&reverse=true').addClass('reverse');      
    }
  }
};