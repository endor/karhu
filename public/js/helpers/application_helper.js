karhu.ApplicationHelper = {
  flash: function(message) {
    message = karhu.i18n.translate(message);
    $('#flash').html(message).show().delay(4000).fadeOut('slow');
  },
  
  beautifyInputElements: function() {
    $('.datepicker').datepicker(_.extend(karhu.config.datepicker, {
      onClose: function() { $('body').trigger('datepickerClosed'); }
    }));
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

  updatePaginationLinks: function() {
    var $pagination = $('.controls .pagination'),
      template = 'templates/shared/pagination_link.mustache',
      paginated_objects = karhu.objectForPagination;

    $pagination.html('');

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
      $('.main form').validate(karhu.i18n.translateValidationMessages(validations));
    }
  }
};