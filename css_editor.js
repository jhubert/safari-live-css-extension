var LiveCSSEditor = (function () {
  var is_enabled = false,
      cssCache = '',
      timer = null;

  function get(id) {
    return document.getElementById('LiveCSSEditor-' + id); 
  }

  function toggleBottom() {
    var panel = get('panel');
    if (panel.className.indexOf('bottom') === -1) {
      panel.className += ' bottom';
    } else {
      panel.className = panel.className.replace(' bottom', '');
    }
  }

  function removeEditor() {
    if (confirm('This will erase the changes you have made. Are you sure you want to do this?')) {
      var css = get('PageCSS'), 
          panel = get('panel');

      clearInterval(timer);
      css.parentElement.removeChild(css);
      panel.parentElement.removeChild(panel);
      is_enabled = false;
    }
  }

  function activateButtons() {
    var bottomButton = get('bot'),
        closeButton = get('close');

    bottomButton.onclick = toggleBottom;
    closeButton.onclick = removeEditor;
  }

  function addEditorPane() {
    var objPanel = document.createElement('div');
    objPanel.setAttribute('id', 'LiveCSSEditor-panel');
    objPanel.innerHTML = '<div id="LiveCSSEditor-actions"><div id="LiveCSSEditor-close">Bottom</div><div id="LiveCSSEditor-bot">Bottom</div></div><div id="LiveCSSEditor-pad"><div id="LiveCSSEditor-label">Live CSS Editor</div><textarea id="LiveCSSEditor-code"></textarea></div>';

    document.body.appendChild(objPanel);
    
    activateButtons();
  }

  function addStyleTag() {
    var head = document.getElementsByTagName('head')[0],
        obj = document.createElement('style');

    obj.id = 'LiveCSSEditor-PageCSS';
    obj.setAttribute("type", "text/css");
    head.appendChild(obj);
  }

  function fillStyleTag(css) {
    var obj = get('PageCSS');
    obj.innerHTML = css;
    cssCache = css;
  }

  function autoUpdate() {
    var source = get('code');
    /* Don't bother replacing the CSS if it hasn't changed */
    if (cssCache === source.value) { 
      return false; 
    }
    fillStyleTag(source.value);
  }

  function startAutoUpdate() {
    timer = setInterval(autoUpdate, 1000);
  }

  function init() {
    addStyleTag();
    fillStyleTag();
    addEditorPane();
    is_enabled = true;
    startAutoUpdate();
  }

  return {
    startIt: function () {
      init();
    },
    stopIt: function () {
      removeEditor();
    },
    enabled: function () {
      return is_enabled;
    }
  };
}());

function handleMessage(msgEvent) {
  var messageName = msgEvent.name;

  if (messageName === "LiveCSSEditor") { 
    if (LiveCSSEditor.enabled() === true) {
      LiveCSSEditor.stopIt();
    } else {
      LiveCSSEditor.startIt();
    }
  }
}

safari.self.addEventListener("message", handleMessage, false);