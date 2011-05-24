describe("EditProduct", function() {
  it("should selected the category of the product", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var product = {id: 1, name: 'Fichte', category_id: 2};
    var view = new karhu.EditProduct(product, categories);
    expect(view.categories[1].selected).toBe(true);
  });
  
  it("should overwrite attributes with those of the last edited product", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var last_edited_product = {data: {category_id: 1, name: 'Kiefer'}}
    var product = {id: 1, name: 'Fichte', category_id: 2};
    var view = new karhu.EditProduct(product, categories, last_edited_product);
    expect(view.categories[0].selected).toBe(true);
    expect(view.name).toEqual('Kiefer');
  });
});