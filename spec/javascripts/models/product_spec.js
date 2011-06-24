describe("Product", function() {
  beforeEach(function() {
    karhu.i18n = { translate: function() {} };
    karhu.locale = 'en';
  });
  
  describe("toTemplate", function() {
    it("should assign itself its category", function() {
      var category = {toJSON: function() { return {id: 2, name: 'Baeume'}; } };
      karhu.Categories = {
        get: function() { return category; }
      }
      var product = new karhu.Product({id: 1, name: 'Fichte', category_id: 2});
      expect(product.toTemplate().category.name).toEqual('Baeume');
    });    
  });
  
  describe("formattedUnitPrice", function() {
    it("should add a € to the price", function() {
      var product = new karhu.Product({id: 1, name: 'Fichte', category_id: 2, unit_price: 2.00});
      expect(product.formattedUnitPrice()).toEqual('2.00€');
    });
  
    it("should format the price in german format if locale is german", function() {
      $.global.preferCulture('de');
      var product = new karhu.Product({id: 1, name: 'Fichte', category_id: 2, unit_price: 2000.35});
      expect(product.formattedUnitPrice()).toEqual('2.000,35€');
    });
  
    it("should format the price in english format if locale is english", function() {
      $.global.preferCulture('en');
      var product = new karhu.Product({id: 1, name: 'Fichte', category_id: 2, unit_price: 2000.35});
      expect(product.formattedUnitPrice()).toEqual('2,000.35€');
    });    
  });

  describe("formattedValidTo", function() {
    it("should format the date in german format if locale is german", function() {
      $.global.preferCulture('de');
      var product = new karhu.Product({id: 1, name: 'Fichte', description: 'Baum', category_id: 2, valid_to: '12/10/2002'});
      expect(product.formattedValidTo()).toEqual('10.12.2002');
    });

    it("should format the date in english format if locale is english", function() {
      $.global.preferCulture('en');
      var product = new karhu.Product({id: 1, name: 'Fichte', description: 'Baum', category_id: 2, valid_to: '12/10/2002'});
      expect(product.formattedValidTo()).toEqual('12/10/2002');
    });
  });
  
  describe("toJSON()", function() {
    it("should parse the price and dump it as float", function() {
      var product = new karhu.Product({id: 1, name: 'Fichte', category_id: 2, unit_price: '2.00€', valid_to: '12/10/2002'});
      expect(product.toJSON().unit_price).toEqual(2.00);
    });
    
    it("should parse the date and dump it as american date format", function() {
      $.global.preferCulture('de');
      var product = new karhu.Product({id: 1, name: 'Fichte', category_id: 2, valid_to: '10.12.2002'});
      expect(product.toJSON().valid_to).toEqual('12/10/2002');
      $.global.preferCulture('en');
    });
  });
});