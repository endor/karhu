describe("EditProduct", function() {
  it("should selected the category of the product", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var product = {id: 1, name: 'Fichte', category_id: 2};
    var view = new karhu.EditProduct(product, categories);
    expect(view.categories[1].selected).toBe(true);
  });
  
  it("should only export categories that have an id", function() {
    var categories = [{id: 1, name: 'Papiere'}, {name: 'Musik'}, {id: 3, name: 'Baeume'}];
    var view = new karhu.EditProduct({}, categories);
    expect(view.categories).toEqual([
      {id: 1, name: 'Papiere'},
      {id: 3, name: 'Baeume'}
    ]);
  });
  
  it("should overwrite attributes with those of the last edited product", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var last_edited_product = {data: {category_id: 1, name: 'Kiefer'}}
    var product = {id: 1, name: 'Fichte', category_id: 2};
    var view = new karhu.EditProduct(product, categories, last_edited_product);
    expect(view.categories[0].selected).toBe(true);
    expect(view.name).toEqual('Kiefer');
  });
  
  it("should format the price with german format if locale is german", function() {
    var categories = [{id: 2, name: 'Baeume'}];

    $.global.preferCulture('de');
    var product = {id: 1, name: 'Fichte', category_id: 2, unit_price: 2000.57};
    var view = new karhu.EditProduct(product, categories);
    expect(view.unit_price).toEqual('2.000,57€');
  });

  it("should format the price with english format if locale is english", function() {
    var categories = [{id: 2, name: 'Baeume'}];
    
    $.global.preferCulture('en');
    var product = {id: 1, name: 'Fichte', category_id: 2, unit_price: 2000.57};
    var view = new karhu.EditProduct(product, categories);
    expect(view.unit_price).toEqual('2,000.57€');
  });

  it("should format the date with german format if locale is german", function() {
    var categories = [{id: 2, name: 'Baeume'}];

    $.global.preferCulture('de');
    var product = {id: 1, name: 'Fichte', category_id: 2, valid_to: '12/10/2002'};
    var view = new karhu.EditProduct(product, categories);
    expect(view.valid_to).toEqual('10.12.2002');
  });

  it("should format the date with english format if locale is english", function() {
    var categories = [{id: 2, name: 'Baeume'}];
    
    $.global.preferCulture('en');
    var product = {id: 1, name: 'Fichte', category_id: 2, valid_to: '12/10/2002'};
    var view = new karhu.EditProduct(product, categories);
    expect(view.valid_to).toEqual('12/10/2002');
  });
  
  it("should fill in one year from now as valid to if no other date is given", function() {
    var view = new karhu.EditProduct({}, []);
    var one_year_from_now = (1).year().fromNow();
    expect(view.valid_to).toEqual($.global.format(one_year_from_now, "d"));
  });
  
  it("should handle strings for prices correctly", function() {
    var categories = [{id: 2, name: 'Baeume'}];

    $.global.preferCulture('en');
    var product = {id: 1, name: 'Fichte', category_id: 2, unit_price: '2,000.57€'};
    var view = new karhu.EditProduct(product, categories);
    expect(view.unit_price).toEqual('2,000.57€');    
  });
});