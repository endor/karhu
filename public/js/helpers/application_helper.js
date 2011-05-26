karhu.ApplicationHelper = {
  flash: function(message) {
    message = $.global.localize("karhu")[message] || message;
    $('#flash').html(message).show().delay(4000).fadeOut('slow');
  },
  
  beautifyInputElements: function() {
    $('input:submit, a.button').button();
    $('.datepicker').datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: Date.today(),
      defaultDate: (1).year().fromNow(),
      onClose: function() { $('body').trigger('datepickerClosed'); }
    });
  },
  
  prepareCancelButtons: function() {
    $('.cancel').live('click', function() {
      $(this).prepend('<input type="hidden" name="cancel" value="true" />');
    });
  },
  
  authenticate: function(xhr) {
    var token = '';
    if(karhu.token) {
      token = karhu.token;
    } else if(karhu.user && karhu.password) {
      token = SHA256(karhu.user + karhu.password);
    }
    karhu.token = token;
    xhr.setRequestHeader("X-Karhu-Authentication", 'user="' + karhu.user + '", token="' + karhu.token + '"');
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
            beforeSend: function(xhr) { context.authenticate(xhr); },
            success: function() { context.stateChangedToOnline(); },
            error: function() {}
          });
        });        
      } else {
        $.ajax({
          url: url + (verb === 'get' ? '?random=' + (new Date).getTime() : ''),
          data: data,
          type: verb,
          beforeSend: function(xhr) {
            context.authenticate(xhr);
          },
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
            };
          })()
        });
      }
    };
  });
})();