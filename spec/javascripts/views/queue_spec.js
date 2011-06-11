describe("Queue", function() {
  beforeEach(function() {    
    ['en', 'de'].forEach(function(locale) {
      $.global.localize("karhu", locale, karhu.locales[locale] || {});
    });
    $.global.preferCulture('en');
    
    store = {
      get: function() {
        return store.data;
      },
      
      set: function(data) {
        store.data = data;
      }
    }
    
    karhu.i18n = {
      translate: function(str) {
        return $.global.localize("karhu")[str];
      }
    }
  });
  
  it("should return human readable summaries", function() {
    store.set([
      {verb: 'post', data: {name: 'Fichte', description: 'Nadelbaum'}, url: '/products'},
      {verb: 'put', data: {name: 'Baeume', description: 'Gruen'}, url: '/categories/2'}
    ]);
    var queue = new karhu.Queue('offline', store);
    
    expect(queue.render().cached_actions[0].humanReadableSummary).toEqual('Created Product Fichte');
    expect(queue.render().cached_actions[1].humanReadableSummary).toEqual('Updated Category Baeume');
  });
  
  it("should return human readable attributes", function() {
    var categories = [{id: 11, name: 'Papiere'}, {id: 12, name: 'Baeume'}];
    store.set([
      {verb: 'post', data: {name: 'Fichte', unit_price: '77', valid_to: '03/03/2009', category_id: '12'}, url: '/products'}
    ]);
    var queue = new karhu.Queue('offline', store);

    expect(queue.render(categories).cached_actions[0].humanReadableAttributes).toEqual('Name: Fichte, Price: 77, Valid To: 03/03/2009, Category: Baeume');
  });
});