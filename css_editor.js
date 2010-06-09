var LiveCSSEditor = function() {
  var head = document.getElementsByTagName('body')[0];

  this.enabled = false;
  this.cssCache = '';

  function _addEditorPane() {
    var objPanel, objHeader, objTextArea, objContainer;

    objHeader = document.createElement('h2');
    objHeader.innerHTML = 'Live CSS Editor';

    objTextArea = document.createElement('textarea');
    objTextArea.setAttribute('id','LiveCSSEditor-code');

    objContainer = document.createElement('div');
    objContainer.appendChild(objHeader);
    objContainer.appendChild(objTextArea);
    
    objPanel = document.createElement('div');
    objPanel.setAttribute('id','LiveCSSEditor-panel');
//    objPanel.setAttribute('style','display: none;');
    objPanel.appendChild(objContainer);

    document.body.appendChild(objPanel);
  }

  function _addStyleTag() {
    var obj = document.createElement('style');
    obj.id = 'LiveCSSEditor-PageCSS';
    obj.setAttribute("type", "text/css");
    head.appendChild(obj);
  }
  
  function _addPageStyles() {
    var objs = document.getElementsByTagName('link'), urls = [];
    for(var i in objs) {
      if (objs.hasOwnProperty(i)) {
        var href = objs[i].href;
        if (typeof href !== "undefined" && href.indexOf('LiveCSS') === -1) {
          urls.push(href);
          objs[i].parentNode.removeChild(objs[i]);
        }
      }
    }
    if (urls.length > 0) {
      var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20p.content%20from%20html%20where%20url%20in%20("' + escape(urls.join('", "')) + '")&format=json&callback=LiveCSSEditor.loadExternalPageStyles';
      var obj = document.createElement('script');
      obj.src = url;
      obj.setAttribute('type','text/javascript');
      head.appendChild(obj);
    }
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
    if (this.cssCache === source.value) { return }
    _fillStyleTag(source.value);
  }
  
  function _startAutoUpdate() {
    setInterval(_autoUpdate,1000);
  }
  
  function addExternalPageStyles(items) {
    var content = '';
    for(var i in items) {
      content += items[i].p;
    }
    content += "\n /* Your CSS */\n\n" ;
    content += this.cssCache;
    var target = document.getElementById('LiveCSSEditor-code');
    target.value = content;
  }
  
  function _init() {
    this.enabled = true;
    _addStyleTag();
    _fillStyleTag();
    _addEditorPane();
    _startAutoUpdate();
    // _addPageStyles();
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
