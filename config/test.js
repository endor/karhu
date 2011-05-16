config = {
  store: new Sammy.Store({name: 'karhu', type: ['cookie']})
}

$.facebox.settings.reveal_function = function(nodes) {
  nodes.show();
};
$.facebox.settings.close_immediately = true;
$.facebox.settings.overlay = false;