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
    $('input, textarea').keydown(function(evt) {
      if(evt.keyCode !== 27 && !(evt.keyCode === 13 && evt.ctrlKey === true)) {
        evt.stopPropagation();
      }
    });
  },
  
  prepareCancelButtons: function() {
    $('.cancel').live('click', function() {
      $(this).prepend('<input type="hidden" name="cancel" value="true" />');
    });
  },

  prepareLinks: function() {
    $('.logout').click(function(evt) {
      $('#logout_form').submit();
      evt.preventDefault();
    });
  },
  
  showLinks: function() {
    if(karhu.token) {
      $('.logout, .keyboard_shortcuts').parent().show();
    } else {
      $('.logout, .keyboard_shortcuts').parent().hide();
    }
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
  },
  
  updatePagination: function(paginated_objects) {
    var $pagination = $('.controls .pagination'),
      template = 'templates/shared/pagination_link.mustache';

    $pagination.html('');
    karhu.pagination = paginated_objects;

    if(paginated_objects && paginated_objects.total_pages > 1) {
      for(var i = 1; i <= paginated_objects.total_pages; i += 1) {
        this.render(template, {url: paginated_objects.url, page: i}, function(rendered_view) {
          $pagination.append(rendered_view);
        });
      }
      $('.controls').show();
    } else {
      $('.controls').hide();
    }
  },
  
  validateForm: function() {
    if(this.objectForValidation) {
      var validations = this.objectForValidation.validations();
      $('.main form').validate(this.translateValidationMessages(validations));
    }
  },  
  
  randomUrl: function(url, verb) {
    return url + (verb === 'get' ? '?random=' + (new Date()).getTime() : '');
  }
};

(function() {
  ['get', 'post', 'delete', 'put'].forEach(function(verb) {
    karhu.ApplicationHelper['ajax_' + verb] = function(url, data, success, error) {
      var context = this;
      
      if(karhu.offline) {
        context.storeInOfflineQueue(verb, data, url, success);
        context.checkForOnlineStatus();
      } else {
        $.ajax({
          url: context.randomUrl(url, verb),
          data: data,
          type: verb,
          beforeSend: function(xhr) {
            context.authenticate(xhr);
          },
          success: function(result) {
            if(verb !== 'get') {
              context.storeInOnlineQueue(verb, result, url);              
            }            
            success(result);
          },
          error: (function() {
            return function(xhr, errorMessage, tmp) {
              if(xhr.status === 0 && xhr.readyState === 0) {
                context.stateChangedToOffline();
                context.storeInOfflineQueue(verb, data, url, success);
              }
              if(error) { error.call(context); }
            };
          })()
        });
      }
    };
  });
})();