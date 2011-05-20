describe("EditProduct", function() {
  it("should selected the category of the product", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var product = {id: 1, name: 'Fichte', category_id: 2};
    var view = new karhu.EditProduct(product, categories);
    expect(view.categories[1].selected).toBe(true);
  });
});