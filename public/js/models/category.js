karhu.Category = function() {
  var category = {};
  
  category.validations = function() {
    return {
      rules: {
        'category[name]': {required: true},
        'category[description]': {required: true}
      },
      messages: {
        'category[name]': 'cannot be empty',
        'category[description]': 'cannot be empty'
      }
    };
  };
  
  return category;
};