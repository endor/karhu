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

  updatePagination: function() {
    var $pagination = $('.controls .pagination'),
      template = 'templates/shared/pagination_link.mustache',
      paginated_objects = this.objectForPagination;

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
  
  backend: function() {
    this._backend = this._backend || new karhu.Backend(this);
    return this._backend;
  },
  
  get: function(url, data, success, error) {
    this.backend().get(url, data, success, error);
  },
  
  post: function(url, data, success, error) {
    this.backend().post(url, data, success, error);
  },
  
  put: function(url, data, success, error) {
    this.backend().put(url, data, success, error);
  },
  
  del: function(url, data, success, error) {
    this.backend().del(url, data, success, error);
  }
};