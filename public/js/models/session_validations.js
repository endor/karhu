karhu.SessionValidations = function() {
  var session = {};
  
  session.validations = function() {
    return {
      rules: {
        'session[user]': {
          required: true
        },
        'session[password]': {
          required: true
        },
      },
      messages: {
        'session[user]': {
          required: 'cannot_be_empty'
        },
        'session[password]': {
          required: 'cannot_be_empty'
        }
      }
    };
  };
  
  return session;
};