karhu.Categories = new karhu.CategoryCollection();
karhu.Categories.fetch();

karhu.Products = new karhu.ProductCollection();
karhu.Products.fetch();

karhu.Collections = {
  categories: karhu.Categories,
  products: karhu.Products
};


new karhu.I18n(store);