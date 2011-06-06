karhu.Category = function() {
  this.validations = function() {
    return {
      rules: {
        'category[name]': {
          required: true,
          maxlength: 100
        },
        'category[description]': {
          required: true
        }
      },
      messages: {
        'category[name]': {
          required: 'cannot_be_empty',
          maxlength: 'cannot_be_longer_than_100_characters'
        },
        'category[description]': {
          required: 'cannot_be_empty'
        }
      }
    };
  };
};