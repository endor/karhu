karhu.ApplicationHelper = {
  flash: function(message) {
    $('#flash').html(message).show().delay(4000).fadeOut('slow');
  },
  
  beautifyInputElements: function() {
    $('input:submit, a.button').button();
    $('.datepicker').datepicker({
      changeMonth: true,
			changeYear: true
    });
  },
  
  handleCancel: function(cancel, redirect_url, callback) {
    if(cancel) {
      this.redirect(redirect_url);
    } else {
      callback.call(this);
    }
  },
  
  prepareCancelButtons: function() {
    $('.cancel').live('click', function() {
      $(this).prepend('<input type="hidden" name="cancel" value="true" />');
    });
  },
  
  validate: function(class_name) {
    var object = new karhu[class_name]();
    $('.main form').validate(_.extend(object.validations(), {}));
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
          url: url + (verb === 'get' ? '?random=' + (new Date).getTime() : ''),
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
            };
          })()
        });
      }
    };
  });
})();