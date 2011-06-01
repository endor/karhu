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
  });
});