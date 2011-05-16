Users = function(karhu) {
  karhu.post('#/users', function(context) {
    $.ajax({
      url: context.users_url(),
      data: {em: context.params.email, pw: context.params.password},
      type: 'post',
      success: function() {
        $('.action_container').html('Thank you for registering.');
      },
      error: function(response) {
        context.warn('.main .action_container', JSON.parse(response.responseText).user_msg);
      }
    });
  });
};