karhu.ApplicationHelper = {
  flash: function(message) {
    $('#flash').html(message).show().delay(4000).fadeOut('slow');
  },
  
  configureFacebox: function() {
    $(document).bind('reveal.facebox', function() {
      if($('#facebox #addr').length > 0) {
        $('#facebox .footer').remove();
        $('#facebox_overlay').unbind('click');
        $(document).unbind('keydown.facebox');
      }
    });
  },
  
  beautifyInputElements: function() {
    $('input:submit, a.button').button();
    $('.datepicker').datepicker();
  },
  
  notifyBeforeClosingBrowserWindow: function() {
    var path = this.last_route.path.toString();
    if(path.match(/\/new/) || path.match(/\/edit/)) {
      window.onbeforeunload = function() {
        return "You are currently editing or creating a new record. Are you sure you want to leave?";
      };
      $("a").click(function() { window.onbeforeunload = null; });
    } else {
      window.onbeforeunload = null;
    }
  }
};

(function() {
  ['get', 'post', 'delete', 'put'].forEach(function(verb) {
    karhu.ApplicationHelper['ajax_' + verb] = function(url, data, success, error) {
      var context = this;
      
      if(karhu.offline) {
        context.saveRequestInQueue(verb, data, url, success, function() {
          $.ajax({
            url: '/test',
            success: function() { context.stateChangedToOnline(); },
            error: function() {}
          });
        });        
      } else {
        $.ajax({
          url: url,
          data: data,
          type: verb,
          success: function(result) {
            context.store.set(verb + url, result);
            success(result);
          },
          error: (function() {
            return function(xhr, errorMessage, tmp) {
              if(xhr.status === 0 && xhr.readyState === 0) {
                context.stateChangedToOffline();
                context.saveRequestInQueue(verb, data, url, success);
              }
              if(error) { error.call(context); }
            }
          })()
        });
      }
    };
  });
})();