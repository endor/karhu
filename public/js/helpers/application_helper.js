var ApplicationHelper = {
  flash: function(message) {
    $('#flash').html(message).show().delay(2000).fadeOut('slow');
  },
  
  configure_facebox: function() {
    $(document).bind('reveal.facebox', function() {
      if($('#facebox #addr').length > 0) {
        $('#facebox .footer').remove();
        $('#facebox_overlay').unbind('click');
        $(document).unbind('keydown.facebox');
      }
    });
  },

  ajax_get: (function() {
    var error_function = function(a, b, c) { console.log(a, b, c); }

    return function(url, data, success, error) {
      $.ajax({
        url: url,
        data: data,
        type: 'get',
        success: success,
        error: error || error_function
      });
    }
  })()
};
