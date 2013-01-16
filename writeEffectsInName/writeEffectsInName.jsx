/*
    Name............writeEffectsInName.jsx
    Version.........1.0
    Description.....This script rename each selected layer, with the names of the effects applied to it.
    Support......... CS3 or later
    OriginalScript by nab Scripts writeEffectsInMarker.jsx
    rescripted  by Lian
*/

(function(){
    //Abbrモードを使わない場合はfalseに
    var abbrMode = true;
    var abbrObj = {};

    function getAbbrv()
    {
        var Abbr_File = './effectsAbbrv.js';
        try{
            var file_handle = new File(Abbr_File);
            if(!file_handle.exists){
                Window.alert("I can't find 'effectsAbbrv.js'");
                return;
            }
            file_handle.open('r');
            while(!file_handle.eof){
                txt = file_handle.readln();
                abbrObj[txt.split(',')[0].replace('', '', 'g')] = txt.split(',')[1];
            }
            file_handle.close();
        }catch(e){
            Window.alert(e);
        }
    }

    function abbrv(name)
    {
        if(abbrObj[name.replace(' ','','g')]){
            return abbrObj[name.replace(' ','','g')];
        }else{
            return name.replace(' ', '', 'g');
        }

    }

    function initGlobals(G)
    {
        G.NAME                      =   "writeEffectsInName.jsx";
        G.TITLE                     =   "Write Effects In Name";
        G.SEPARATOR                 =   "/";
        G.NO_PROJ_ERR               =   {en:"Open a project first.", jp:"プロジェクトを開いて下さい."};
        G.NO_COMP_ERR               =   {en:"Select a composition.", jp:"コンポジションを選択して下さい."};
        G.NO_LAYER_ERR              =   {en:"Select at least one layer.", jp:"少なくとも1つのレイヤーを選択して下さい."};
    }

    function loc(str)
    {
        return app.language == Language.JAPANESE ? str["jp"] : str["en"];
    }

    function throwMsg(msg)
    {
        alert(loc(msg), G.TITLE);
    }

    function getEffects(layer)
    {
        var effects = new Array();
        if (layer.intensity == null && layer.zoom == null) {
            for (var i = 1; i <= layer.Effects.numProperties; i++) {
                var effect = layer.Effects.property(i);
                if (effect.active) {
                    effects.push(abbrv(effect.name));
                }
            }
        }
        return effects;
    }

    function writeEffectsInName(comp, layers)
    {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var effects = getEffects(layer);
            var layerName = "";
            for (var j = 0; j < effects.length; j++) {
                layerName += effects[j];
                if (j != effects.length - 1) {
                    layerName += G.SEPARATOR;
                }
            }

            if (layerName != "") {
                if(layerName.length > 32){
                    layerName = layerName.substring(0,31)
                }
                layer.name = layerName;
            }
        }
    }

    function Main()
    {
        var proj = app.project;
        if (!proj) {
            throwMsg(G.NO_PROJ_ERR);
            return;
        }
        var comp = proj.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            throwMsg(G.NO_COMP_ERR);
            return;
        }
        if (comp.selectedLayers.length < 1){
            throwMsg(G.NO_LAYER_ERR);
            return;
        }
        if (abbrMode){
            getAbbrv();
        }

        app.beginUndoGroup(G.TITLE);

        writeEffectsInName(comp, comp.selectedLayers);

        app.endUndoGroup();
    }

    // Entry Point
    var G = new Object();
    initGlobals(G);
    Main();

})();
