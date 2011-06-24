describe("CachedLists", function() {
  beforeEach(function() {
    store.clear();
    cachedLists = new karhu.CachedLists(store);
  });

  describe("process", function() {
    it("should add objects to the list", function() {
      cachedLists.process({verb: 'post', data: {id: 1, name: 'Kaffees'}, url: '/categories'});
      expect(store.get('/categories')[0].name).toEqual('Kaffees');
    });
    
    it("should update objects in the list", function() {
      cachedLists.process({verb: 'post', data: {id: 1, name: 'Kaffees'}, url: '/categories'});
      cachedLists.process({verb: 'put', data: {name: 'Tees'}, url: '/categories/1'});
      expect(store.get('/categories')[0].name).toEqual('Tees');
      expect(store.get('/categories').length).toEqual(1);
    });
    
    it("should remove objects from the list", function() {
      cachedLists.process({verb: 'post', data: {id: 1, name: 'Kaffees'}, url: '/categories'});
      cachedLists.process({verb: 'post', data: {id: 2, name: 'Tees'}, url: '/categories'});
      cachedLists.process({verb: 'delete', data: {}, url: '/categories/1'});
      expect(store.get('/categories')[0].name).toEqual('Tees');
      expect(store.get('/categories').length).toEqual(1);
    });
  });
  
  describe("retrieve", function() {
    it("should retrieve the list", function() {
      cachedLists.process({verb: 'post', data: {id: 1, name: 'Kaffees'}, url: '/categories'});
      cachedLists.process({verb: 'post', data: {id: 2, name: 'Tees'}, url: '/categories'});
      var list = cachedLists.retrieve({verb: 'get', url: '/categories', data: {}});
      expect(list).toEqual([
        {id: 1, name: 'Kaffees'},
        {id: 2, name: 'Tees'}
      ]);
    });
    
    it("should retrieve a single object from the list", function() {
      cachedLists.process({verb: 'post', data: {id: 1, name: 'Kaffees'}, url: '/categories'});
      cachedLists.process({verb: 'post', data: {id: 2, name: 'Tees'}, url: '/categories'});
      var list = cachedLists.retrieve({verb: 'get', url: '/categories/2', data: {}});
      expect(list).toEqual({id: 2, name: 'Tees'});
    });
  });
  
  describe("sort", function() {
    it("should sort categories by name", function() {
      var categories = [
        {name: 'Veltins', description: 'Bier'},
        {name: 'Becks', description: 'Bier'},
        {name: 'Berliner', description: 'Bier'}
      ];
      categories.forEach(function(category) {
        cachedLists.process({verb: 'post', data: category, url: '/categories'});        
      });
      var list = cachedLists.retrieve({verb: 'get', url: '/categories', data: {sort: 'name'}});
      expect(list).toEqual([
        {name: 'Becks', description: 'Bier'},
        {name: 'Berliner', description: 'Bier'},
        {name: 'Veltins', description: 'Bier'}
      ]);
    });

    it("should sort categories by description", function() {
      var categories = [
        {name: 'Margaux', description: 'Wein'},
        {name: 'Hennessy', description: 'Cognac'},
        {name: 'Veltins', description: 'Bier'}
      ];
      categories.forEach(function(category) {
        cachedLists.process({verb: 'post', data: category, url: '/categories'});        
      });
      var list = cachedLists.retrieve({verb: 'get', url: '/categories', data: {sort: 'description'}});
      expect(list).toEqual([
        {name: 'Veltins', description: 'Bier'},
        {name: 'Hennessy', description: 'Cognac'},
        {name: 'Margaux', description: 'Wein'}
      ]);
    });
    
    it("should sort products by valid to date", function() {
      var products = [
        {name: 'Veltins', valid_to: '08/04/2012'},
        {name: 'Berliner', valid_to: '10/12/2011'},
        {name: 'Becks', valid_to: '09/02/2013'}
      ];
      products.forEach(function(product) {
        cachedLists.process({verb: 'post', data: product, url: '/products'});        
      });
      var list = cachedLists.retrieve({verb: 'get', url: '/products', data: {sort: 'valid_to'}});
      expect(list).toEqual([
        {name: 'Berliner', valid_to: '10/12/2011'},
        {name: 'Veltins', valid_to: '08/04/2012'},
        {name: 'Becks', valid_to: '09/02/2013'}
      ]);
    });
    
    it("should sort products by category name", function() {
      var categories = [
        {id: 1, name: 'Weine'},
        {id: 2, name: 'Biere'},
        {id: 3, name: 'Cognacs'}
      ];
      categories.forEach(function(category) {
        cachedLists.process({verb: 'post', data: category, url: '/categories'});        
      });
      var products = [
        {name: 'Hennessy', category_id: 3},
        {name: 'Veltins', category_id: 2},
        {name: 'Margaux', category_id: 1}
      ];
      products.forEach(function(product) {
        cachedLists.process({verb: 'post', data: product, url: '/products'});        
      });
      var list = cachedLists.retrieve({verb: 'get', url: '/products', data: {sort: 'category'}});
      expect(list).toEqual([
        {name: 'Veltins', category_id: 2},
        {name: 'Hennessy', category_id: 3},
        {name: 'Margaux', category_id: 1}
      ]);      
    });
  });
});