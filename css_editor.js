var LiveCSSEditor = function() {
  var head = document.getElementsByTagName('head')[0];

  this.enabled = false;
  this.cssCache = '';

  function _addEditorPane() {
    var objPanel, objHeader, objTextArea, objContainer;

    objHeader = document.createElement('h2');
    objHeader.innerHTML = 'Live CSS';

    objTextArea = document.createElement('textarea');
    objTextArea.setAttribute('id','LiveCSSEditor-code');

    objContainer = document.createElement('div');
    objContainer.appendChild(objHeader);
    objContainer.appendChild(objTextArea);
    
    objPanel = document.createElement('div');
    objPanel.setAttribute('id','LiveCSSEditor-panel');
    objPanel.appendChild(objContainer);

    document.body.appendChild(objPanel);
  }

  function _addStyleTag() {
    var obj = document.createElement('style');
    obj.id = 'LiveCSSEditor-PageCSS';
    obj.setAttribute("type", "text/css");
    head.appendChild(obj);
  }

  function _fillStyleTag(css) {
    var obj = document.getElementById('LiveCSSEditor-PageCSS');
    if (obj.styleSheet) {   // IE
      obj.styleSheet.cssText = css;
    } else {                // the world
      if (obj.lastChild) {
        obj.removeChild(obj.lastChild);
      }
      var txt = document.createTextNode(css);
      obj.appendChild(txt);
    }
    this.cssCache = css;
  }

  function _autoUpdate() {
    var source = document.getElementById('LiveCSSEditor-code');
    /* Don't bother replacing the CSS if it hasn't changed */
    if (this.cssCache === source.value) { return false; }
    _fillStyleTag(source.value);
  }

  function _startAutoUpdate() {
    setInterval(_autoUpdate,1000);
  }

  function _init() {
    this.enabled = true;
    _addStyleTag();
    _fillStyleTag();
    _addEditorPane();
    _startAutoUpdate();
  }

  function _removeEditor() {
    var obj = document.getElementById('LiveCSSEditor-PageCSS');
    obj.parentElement.removeChild(obj);
    var obj = document.getElementById('LiveCSSEditor-panel');
    obj.parentElement.removeChild(obj);
    this.enabled = false;
  }

  return {
    loadExternalPageStyles: function (r) {
      if (r.query && r.query.results && r.query.results.body) {
        addExternalPageStyles(r.query.results.body);
      }
    },
    startIt: function() {
      if (this.enabled) {
        _removeEditor();
      } else {
        _init();        
      }
    },
    stopIt: function() {
      _removeEditor();
    }
  };
}();

function handleMessage(msgEvent) {
  var messageName = msgEvent.name;
  var messageData = msgEvent.message;
  if (messageName === "LiveCSSEditor") { 
    if (messageData === "stop") {
      LiveCSSEditor.stopIt();
    }
    if (messageData === "start") {
      LiveCSSEditor.startIt();
    }
  }
}

safari.self.addEventListener("message", handleMessage, false);
