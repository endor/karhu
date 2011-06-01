karhu.KeyboardHelper = {
  actionOnKeydown: function(keycode, ctrlkey) {
    if(keycode === 39 && ctrlkey) {
      if(karhu.pagination && karhu.pagination.current_page < karhu.pagination.total_pages) {
        $('.pagination [data-key="' + (karhu.pagination.current_page + 1) + '"]').click();
      }
    } else if(keycode === 37 && ctrlkey) {
      if(karhu.pagination && karhu.pagination.current_page > 1) {
        $('.pagination [data-key="' + (karhu.pagination.current_page - 1) + '"]').click();
      }
    } else if(keycode === 36 && ctrlkey) {
      if(karhu.pagination) {
        $('.pagination [data-key="1"]').click();
      }
    } else if(keycode === 35 && ctrlkey) {
      if(karhu.pagination) {
        $('.pagination [data-key="' + karhu.pagination.total_pages + '"]').click();
      }      
    } else {
      return false;
    }
  },
  
  initializeKeyboardControl: function() {
    var usedKeyCodes = {
        '65': 'a', '67': 'c', '68': 'd', '69': 'e', '76': 'l', '80': 'p',
        '49': '1', '50': '2', '51': '3', '52': '4', '53': '5', '54': '6',
        '55': '7', '56': '8', '57': '9', '27': 'esc', '13': 'enter',
        '75': 'k', '81': 'q'
      },
      context = this;

    $(document).keydown(function(evt) {
      if(!context.actionOnKeydown(evt.keyCode, evt.ctrlKey)) {
        var selector = '[data-key="' + usedKeyCodes[evt.keyCode] + '"]';
        if(evt.ctrlKey) { selector += '[data-ctrl-key="true"]'; }
        $(selector).click();        
      }
    });    
  }
};