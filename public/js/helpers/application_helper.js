var ApplicationHelper = {
  flash: function(message) {
    $('#flash').html(message).show().delay(2000).fadeOut('slow');
  },
  
  render_main: function(callback) {
    return function(html) {
      $('.main').html(html);
      if(callback) { callback(); }
    };
  },
  
  render_details: function(html) {
    $('#col-l .details').html(html);
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
  
  internal_redirect: function(path) {
    this.store.set('authenticated', true);
    this.app.runRoute('get', path);
  },
  
  cache: function() {
    if(!this._cache) { this._cache = {}; }
    return this._cache;
  },
  
  authenticate: function(xhr, url, email, password_sha) {
    email = email || this.store.get('email');
    password_sha = password_sha || this.store.get('password_sha');
    var token = SHA256(password_sha + email + url);
    var auth = 'username="' + email + '", response="' + token + '", version="1"';
    xhr.setRequestHeader("X-Naama-Authentication", auth);
  },
  
  warn: function(preselector, message) {
    $(preselector + ' .warning').text(message).show();
  }  
};
