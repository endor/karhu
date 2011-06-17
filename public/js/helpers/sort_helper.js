karhu.SortHelper = {
  markSortColumn: function() {
    $('th, td').removeClass('selected');
    if(karhu.sort) {
      $('.' + karhu.sort + '_column').addClass('selected');
    }

    var link = $('a.reverse');
    if(link.length > 0) {
      link.attr('href', link.attr('data-link')).removeClass('reverse');
    }
    
    if(!karhu.reverse) {
      link = $('th.' + karhu.sort + '_column a');
      link.attr('href', link.attr('href') + '&reverse=true').addClass('reverse');      
    }
  }
};