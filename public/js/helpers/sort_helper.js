karhu.SortHelper = {
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
      link = $('th.' + this.sort + '_column a');
      link.attr('href', link.attr('href') + '&reverse=true').addClass('reverse');      
    }
  }
};