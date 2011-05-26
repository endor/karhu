karhu.CustomValidatorsHelper = {
  initializeCustomValidators: function() {
    $.validator.addMethod("formatted", function(value, element) {
      return value.match(this.settings.rules[$(element).attr('name')].formatted);
    });
    
    $.validator.addMethod("dateLargerThan", function(value, element) {
      var expected = this.settings.rules[$(element).attr('name')].dateLargerThan.clearTime();
      var actual = Date.parse(value);

      if(actual === null) { return false; }
      
      return expected.compareTo(actual.clearTime()) < 0;
    });
    
    $('body').bind('datepickerClosed', function(evt) {
      $('.main form').valid();
    });    
  }
};
