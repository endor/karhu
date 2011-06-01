describe("CacheHelper", function() {
  describe("sortList", function() {
    beforeEach(function() {
      sortList = karhu.CacheHelper.sortList;
    });
    
    it("should sort categories by name", function() {
      var categories = [
        {name: 'Veltins', description: 'Bier'},
        {name: 'Becks', description: 'Bier'},
        {name: 'Berliner', description: 'Bier'}
      ];
      expect(sortList(categories, 'name')).toEqual([
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
      expect(sortList(categories, 'description')).toEqual([
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
      expect(sortList(products, 'valid_to')).toEqual([
        {name: 'Berliner', valid_to: '10/12/2011'},
        {name: 'Veltins', valid_to: '08/04/2012'},
        {name: 'Becks', valid_to: '09/02/2013'}
      ]);
    });
    
    it("should sort products by category name", function() {
      store = {
        get: function() {
          return [
            {id: 1, name: 'Weine'},
            {id: 2, name: 'Biere'},
            {id: 3, name: 'Cognacs'}
          ];
        }
      }
      var products = [
        {name: 'Hennessy', category_id: 3},
        {name: 'Veltins', category_id: 2},
        {name: 'Margaux', category_id: 1}
      ];
      expect(sortList(products, 'category')).toEqual([
        {name: 'Veltins', category_id: 2},
        {name: 'Hennessy', category_id: 3},
        {name: 'Margaux', category_id: 1}
      ]);      
    });
  });
});