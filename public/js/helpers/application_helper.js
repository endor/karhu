karhu.ApplicationHelper = {
  flash: function(message) {
    $('#flash').html(message).show().delay(4000).fadeOut('slow');
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
  
  beautify_input_elements: function() {
    $('input:submit, a.button').button();
    $('.datepicker').datepicker();
  },
  
  notify_before_closing_browser_window: function(context) {
    var path = context.last_route.path.toString();
    if(path.match(/\/new/) || path.match(/\/edit/)) {
      window.onbeforeunload = function() {
        return "You are currently editing or creating a new record. Are you sure you want yo leave?";
      };
      $("a").click(function() { window.onbeforeunload = null; });
    } else {
      window.onbeforeunload = null;
    }
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