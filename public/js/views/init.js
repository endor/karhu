karhu.views = {
  top: new karhu.TopView(),
  newItem: new karhu.NewView(),
  edit: new karhu.EditView(),
  main: new karhu.MainView()
};

_.each(karhu.Collections, function(collection) {
  karhu.views.main.bind(collection);
});