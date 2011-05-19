karhu.ApplicationHelper = {
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
  }
};

(function() {
  var errorFunction = function(a, b, c) { console.log(a, b, c); };
  
  ['get', 'post', 'delete', 'put'].forEach(function(verb) {
    karhu.ApplicationHelper['ajax_' + verb] = function(url, data, success, error) {
      $.ajax({
        url: url,
        data: data,
        type: verb,
        success: success,
        error: error || errorFunction
      });      
    };
  });
})();