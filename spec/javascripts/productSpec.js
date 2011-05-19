describe("Product", function() {
  it("should assign itself its category", function() {
    var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
    var attributes = {id: 1, name: 'Fichte', category_id: 2};
    var product = new karhu.Product(attributes, categories);
    expect(product.category.name).toEqual('Baeume');
  });
});