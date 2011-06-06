describe("Product", function() {
  describe("attachCategory", function() {
    it("should assign itself its category", function() {
      var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
      var attributes = {id: 1, name: 'Fichte', category_id: 2};
      var product = new karhu.Product(attributes, categories);
      expect(product.category.name).toEqual('Baeume');
    });    
  });
  
  describe("formatPrice", function() {
    it("should add a € to the price", function() {
      var attributes = {id: 1, name: 'Fichte', category_id: 2, unit_price: 2.00};
      var product = new karhu.Product(attributes);
      expect(product.unit_price).toEqual('2.00€');
    });

    it("should format the price in german format if locale is german", function() {
      $.global.preferCulture('de');
      var attributes = {id: 1, name: 'Fichte', category_id: 2, unit_price: 2000.35};
      var product = new karhu.Product(attributes);
      expect(product.unit_price).toEqual('2.000,35€');
    });

    it("should format the price in english format if locale is english", function() {
      $.global.preferCulture('en');
      var attributes = {id: 1, name: 'Fichte', category_id: 2, unit_price: 2000.35};
      var product = new karhu.Product(attributes);
      expect(product.unit_price).toEqual('2,000.35€');
    });    
  });

  describe("formatValidTo", function() {
    it("should format the date in german format if locale is german", function() {
      $.global.preferCulture('de');
      var attributes = {id: 1, name: 'Fichte', category_id: 2, valid_to: '12/10/2002'};
      var product = new karhu.Product(attributes);
      expect(product.valid_to).toEqual('10.12.2002');
    });

    it("should format the date in english format if locale is english", function() {
      $.global.preferCulture('en');
      var attributes = {id: 1, name: 'Fichte', category_id: 2, valid_to: '12/10/2002'};
      var product = new karhu.Product(attributes);
      expect(product.valid_to).toEqual('12/10/2002');
    });    
  });
  
  describe("toJSON()", function() {
    it("should parse the price and dump it as float", function() {
      var attributes = {id: 1, name: 'Fichte', category_id: 2, unit_price: '2.00€', valid_to: '12/10/2002'};
      var product = new karhu.Product(attributes);
      expect(product.toJSON().unit_price).toEqual(2.00);
    });
    
    it("should parse the date and dump it as american date format", function() {
      $.global.preferCulture('de');
      var attributes = {id: 1, name: 'Fichte', category_id: 2, valid_to: '10.12.2002'};
      var product = new karhu.Product(attributes);
      expect(product.toJSON().valid_to).toEqual('12/10/2002');
      $.global.preferCulture('en');
    });
  });
});