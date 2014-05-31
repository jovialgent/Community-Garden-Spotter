$(function(){
    require(
        [
            //filepaths

            //ESRI CODE
            //Loads basic map 
            "esri/map",
            "esri/arcgis/utils",
            "esri/dijit/LocateButton",
            "esri/dijit/BasemapToggle",
            "esri/dijit/Scalebar",
            "esri/dijit/HomeButton",
            "esri/layers/FeatureLayer",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol", 
            "esri/renderers/SimpleRenderer",
            "esri/Color",

            "esri/graphic",

            //DOJO CODE
            "dojo/dom-style", 
            "dijit/TooltipDialog",
            "dijit/popup",
            "dojo/domReady!"
        ], 
        function(
        //modules

        //Module for map

        Map, 
         ArcgisUtils,
         LocateButton,
         BasemapToggle,
         Scalebar,
         HomeButton,
         FeatureLayer,
         Tiled,
         SimpleFillSymbol,
         SimpleLineSymbol,
         SimpleRenderer,
         Color,
         Graphic,
         domStyle,
         Dialog,
         dijitPopup



        ){
            //code to run

            //Map reference var
            var map;
            var locateButton;

            //initializing new map
            map = new Map("mapDiv", {

                //    map settings
                center: [-104.9926110, 39.7335360],
                zoom: 14,
                basemap: "gray"

            });

            map.infoWindow.resize(245,125);

            var dialog = new Dialog({
                id: "lotPopup",
                style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
            });
            dialog.startup();

            var locateButton = new LocateButton({
                map: map

            }, "locateButton");

            var basemapToggle = new BasemapToggle(
                {
                    map: map,
                    basemap: "streets"
                },
                "basemapToggle"
            );

            basemapToggle.startup();
            basemapToggle.on("error" ,function(msg){
                console.log("basemap gallery error", msg);
            });

            var homeButton = new HomeButton({
                map: map,
            }, "homeButton");
            homeButton.startup();

            var scalebar = new Scalebar({
                map: map,
                scalebarUnit: "dual"
            });

            //INFOWINDOWS



            //LAYERS

            var denverLotsLayer = new FeatureLayer(
                "http://services3.arcgis.com/Msac6VmgidYoGnkC/ArcGIS/rest/services/DenLandUseEcoSoils_selectionZip/FeatureServer/0",
                {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["CPD_LU_I", "Shape_Area", "L1_SOILTYP"]
                });
            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID, 
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID, 
                    new Color([255,255,255,0.35]), 
                    1
                ),
                new Color([117,90,43,0.35])
            );
            var highlightSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID, 
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID, 
                    new Color([89 ,168 ,15]), 1
                    
                ), 
                new Color([45,208,11,0.5])
            );

            denverLotsLayer.setRenderer(new SimpleRenderer(symbol));
            map.addLayer(denverLotsLayer);
            //close the dialog when the mouse leaves the highlight graphic
            map.on("load", function(){
                map.graphics.enableMouseEvents();
                map.graphics.on("mouse-out", closeDialog);

            });
            denverLotsLayer.on("mouse-over", function(evt){
                //dialog.setContent("<h1>Works</h1>");
                var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
                map.graphics.add(highlightGraphic);
                dialog.setContent("<h1>Works?</h1>");

                domStyle.set(dialog.domNode, "opacity", 0.85);
                $('#lotPopup').css({
                    top: evt.pageY + 10,
                    left: evt.pageX + 10
                });
                dijitPopup.open({
                    popup: dialog, 
                    x: evt.pageX,
                    y: evt.pageY
                });
            });

            function closeDialog() {
                map.graphics.clear();
                dijitPopup.close(dialog);
               
            }

        });



});
