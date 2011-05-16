Account = function(karhu) {
  karhu.get('#/account', function(context) {
    context.partial('templates/account/show.mustache', {addresses: context.addresses()}, context.render_main());
  });
  
  karhu.get('#/account/password/edit', function(context) {
    context.partial('templates/account/edit_password.mustache', {}, function(html) {
      $.facebox(html);
      $('#facebox form').validate({
        rules: {
          password_confirmation: {equalTo: "#new_password"},
          old_password: {matchesSHA: context.store.get('password_sha')}
        },
        messages: {
          password_confirmation: 'does not match password',
          old_password: 'is invalid'
        }
      });
    });
  });
  
  karhu.put('#/account/password', function(context) {
    var email = context.store.get('email'),
      url = context.password_url(email);
      
    $.ajax({
      type: 'put',
      url: url,
      beforeSend: function(xhr) {
        context.authenticate(xhr, url, email, SHA256(context.params.old_password));
      },
      data: {password: context.params.new_password},
      success: function() {
        context.store.set('password_sha', SHA256(context.params.new_password));
        $(document).trigger('close.facebox');
        context.flash('Password Changed');
      }
    });
  });
};