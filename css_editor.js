var LiveCSSEditor = (function () {
  var head = document.getElementsByTagName('head')[0];

  this.enabled = false;
  this.cssCache = '';

  function addEditorPane() {
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

  function addStyleTag() {
    var obj = document.createElement('style');
    obj.id = 'LiveCSSEditor-PageCSS';
    obj.setAttribute("type", "text/css");
    head.appendChild(obj);
  }

  function fillStyleTag(css) {
    var txt, obj = document.getElementById('LiveCSSEditor-PageCSS');
    if (obj.styleSheet) {   // IE
      obj.styleSheet.cssText = css;
    } else {                // the world
      if (obj.lastChild) {
        obj.removeChild(obj.lastChild);
      }
      txt = document.createTextNode(css);
      obj.appendChild(txt);
    }
    this.cssCache = css;
  }

  function autoUpdate() {
    var source = document.getElementById('LiveCSSEditor-code');
    /* Don't bother replacing the CSS if it hasn't changed */
    if (this.cssCache === source.value) { return false; }
    fillStyleTag(source.value);
  }

  function startAutoUpdate() {
    setInterval(autoUpdate,1000);
  }

  function init() {
    this.enabled = true;
    addStyleTag();
    fillStyleTag();
    addEditorPane();
    startAutoUpdate();
  }

  function removeEditor() {
    var css = document.getElementById('LiveCSSEditor-PageCSS'), 
        panel = document.getElementById('LiveCSSEditor-panel');
    css.parentElement.removeChild(css);
    panel.parentElement.removeChild(panel);
    this.enabled = false;
  }

  return {
    startIt: function() {
      if (this.enabled) {
        removeEditor();
      } else {
        init();        
      }
    },
    stopIt: function() {
      removeEditor();
    }
  };
}());

function handleMessage(msgEvent) {
  var messageName = msgEvent.name,
      messageData = msgEvent.message;

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