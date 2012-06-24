//
// bpmMarker.jsx scripted by Lian
//
// Usage:
//   1. make composition
//   2. run bpmMarker.jsx
//   3. input BPM and Count
//   4. Execute!
//

(function(thisObj){
  var G = new Object();
  var bpm = 120;
  var count = 4;

  function initGlobals(obj) {
    obj.NAME        = "bpmMarker.jsx";
    obj.TITLE       = "BPM Marker";
    obj.SEPARATOR   = "/";
    obj.LANG        = (app.language === Language.JAPANESE) ? "jp": "en";
    obj.NO_PROJ_ERR = (obj.LANG === "jp") ?
      "プロジェクトを開いて下さい." :
      "Open a project first." ;

    obj.NO_COMP_ERR = (obj.LANG === "jp") ?
      "コンポジションを選択して下さい." :
      "Select a composition.";
    obj.EXE_BUTTON  = (obj.LANG === "jp") ? "実行" : "Apply";
  }

  function throwMsg(msg) {
    alert(msg, G.TITLE);
  }

  function bpmMarker(theComp) {
    var dur = theComp.duration;
    var nullMarker = theComp.layers.addNull();
    nullMarker.name = "BPM";
    var markerDur = 60 / bpm;
    var markerValue = new Array(count);
    var markerTime  = new Array();
    var j = dur * bpm / 60 ;
    for (var i =0; i <= j; ++i){
      markerTime.push(i * markerDur);
    }

    for (var k = 0; k < count; ++k){
      markerValue[k] = new MarkerValue(k+1);
    }

    for (var n = 0; n < markerTime.length; ++n){
      nullMarker.Marker.setValueAtTime(markerTime[n],
                                       markerValue[n%count]);
    }
  }

  function Main(){
    var proj;
    var comp;
    proj = app.project;
    if (!proj){
      throwMsg(G.NO_PROJ_ERR);
      return;
    }
    comp = proj.activeItem;

    if (!comp || !(comp instanceof CompItem)){
      throwMsg(G.NO_COMP_ERR);
      return;
    }
    app.beginUndoGroup(G.TITLE);
    bpmMarker(comp);
    app.endUndoGroup();
  }

  function buildUI(thisObj){
    var palette;
    var bpmGroup, bpmEt;
    var countGroup, countEt;
    var buttonGroup, createButton;
    var STATIC_TEXT_DIMENSIONS = [0, 0, 40, 15];
    var INPUT_TEXT_DIMENSIONS = [0, 0, 60, 15];

    if (thisObj instanceof Panel){
      alert(thisObj);
      palette = thisObj;
    } else {
      alert("not Panel!");
      palette = new Window("palette", "BPMMarker", undefined, {resizeable: true});
    }
    palette.margins = 15;
    palette.alignChildren = 'left';

    // BPM
    bpmGroup = palette.add('group', undefined, 'BPM Group');
    bpmGroup.add("statictext", STATIC_TEXT_DIMENSIONS, "BPM:");
    bpmEt = bpmGroup.add("edittext", INPUT_TEXT_DIMENSIONS, bpm);
    bpmEt.onChange = setBpm;

    countGroup = palette.add('group', undefined, 'Count Group');
    countGroup.add("statictext", STATIC_TEXT_DIMENSIONS, "Count:");
    countEt = countGroup.add("edittext", INPUT_TEXT_DIMENSIONS, count);
    countEt.onChange = setCount;

    buttonGroup = palette.add('group', undefined, 'Button Group');
    buttonGroup.add("statictext", STATIC_TEXT_DIMENSIONS, "");
    createButton = buttonGroup.add("button", INPUT_TEXT_DIMENSIONS, G.EXE_BUTTON);
    createButton.onClick = Main;

    if(palette instanceof Window){
      palette.show();
    } else {
      palette.layout.layout(true);
    }

    function setBpm(){
      var valB = this.text;
      if (isNaN(valB) || parseInt(valB) < 0 || parseInt(valB) > 400){
        alert("Wrong bpm.");
        this.text = bpm;
      }else{
        bpm = parseInt(valB);
      }
    }

    function setCount(){
      var valC = this.text;
      if (isNaN(valC) || parseInt(valC, 10) < 0 || parseInt(valC, 10) > 400){
        alert("Wrong Count value.");
        this.text = count;
      }else{
        count = parseInt(valC, 10);
      }
    }
  }

  // START SCRIPT
  if(parseFloat(app.version) < 7.0){
    alert("This script requires AE7.0 or later.");
  } else {
    initGlobals(G);
    buildUI(thisObj);
  }
})(this);