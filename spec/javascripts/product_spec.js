describe("Product", function() {
  it("should assign itself its category", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var attributes = {id: 1, name: 'Fichte', category_id: 2};
    var product = new karhu.Product(attributes, categories);
    expect(product.category.name).toEqual('Baeume');
  });
  
  it("should parse the price when being dumped to json", function() {
    var attributes = {id: 1, name: 'Fichte', category_id: 2, unit_price: '2.00€'};
    var product = new karhu.Product(attributes);
    expect(product.toJSON().unit_price).toEqual(2.00);
  });
  
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