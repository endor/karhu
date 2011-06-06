describe("Custom Validator Helper", function() {
  beforeEach(function() {    
    karhu.CustomValidatorsHelper.initializeCustomValidators();
    validator = {
      settings: {
        rules: {
          my_number: {
            formatted: /\d/
          },
          my_date: {
            dateLargerThan: (1).year().fromNow()
          }
        }
      }
    };    
  });
  
  describe("formatted", function() {
    beforeEach(function() {
      formatted = $.validator.methods.formatted;
    });
    
    it("should be valid when formatted correctly", function() {
      var input = $('<input value="2" name="my_number" />');
      expect(formatted.call(validator, "2", input)).toBe(true);
    });
    
    it("should be invalid when not formatted correctly", function() {
      var input = $('<input value="a" name="my_number" />');
      expect(formatted.call(validator, "a", input)).toBe(false);
    });
  });
  
  describe("dateLargerThan", function() {
    beforeEach(function() {
      dateLargerThan = $.validator.methods.dateLargerThan;
    });

    it("should be valid when the actual date is larger than the expected date", function() {
      var input = $('<input value="' + (2).years().fromNow().toString('MM/dd/yyyy') + '" name="my_date" />');
      expect(dateLargerThan.call(validator, (2).years().fromNow().toString('MM/dd/yyyy'), input)).toBe(true);      
    });
    
    it("should be invalid when the actual date is smaller or equal to the expected date", function() {
      var input = $('<input value="' + (1).year().fromNow().toString('MM/dd/yyyy') + '" name="my_date" />');
      expect(dateLargerThan.call(validator, (1).year().fromNow().toString('MM/dd/yyyy'), input)).toBe(false);
    });
  });
});