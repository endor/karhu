describe("Queue", function() {
  it("should return human readable summaries", function() {
    var actions = [
      {verb: 'post', data: {name: 'Fichte', description: 'Nadelbaum'}, url: '/products'},
      {verb: 'put', data: {name: 'Baeume', description: 'Gruen'}, url: '/categories/2'}
    ];
    var view = new karhu.Queue(actions);
    
    expect(view.cached_actions[0].humanReadableSummary).toEqual('Created Product Fichte');
    expect(view.cached_actions[1].humanReadableSummary).toEqual('Updated Category Baeume');
  });
  
  it("should return human readable attributes", function() {
    var categories = [{id: 11, name: 'Papiere'}, {id: 12, name: 'Baeume'}];
    var data = {name: 'Fichte', unit_price: '77', valid_to: '03/03/2009', category_id: '12'};
    var actions = [ {verb: 'post', data: data, url: '/products'} ];
    var view = new karhu.Queue(actions, categories);
    
    expect(view.cached_actions[0].humanReadableAttributes).toEqual('Name: Fichte, Unit Price: 77, Valid To: 03/03/2009, Category: Baeume');
  });
});