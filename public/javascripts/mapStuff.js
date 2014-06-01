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
            "esri/lang",
            "esri",

            //DOJO CODE
            "dojo/dom-style", 
            "dijit/TooltipDialog",
            "dijit/popup",
            "dojo/topic",
            "dojo/domReady!",
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
         esriLang,
         esri,

         //DOJO
         domStyle,
         Dialog,
         dijitPopup,
         topic



        ){
            //code to run

            //Map reference var
            var map;
            var locateButton;
            var mapDiv =  $('#mapDiv');
            var titleBar = $('#titlebar');
            var filter = $('#filterNavigator');
            var report = $('#report');
            var helperWindow =  $('#helperWindow');
            var hideWindow = {
                effect : "slide",
                direction: "right"
            }

            var showWindow = {
                effect : "slide",
                direction: "left"
            }

            //initializing new map
            map = new Map("mapDiv", {

                //    map settings
                center: [-104.9926110, 39.7335360],
                zoom: 14,
                basemap: "gray"

            });

            map.infoWindow.resize(275,275);

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
                    basemap: "hybrid"
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
            
            //BEGIN Potential plots
            var featureLayerURL = "http://services3.arcgis.com/Msac6VmgidYoGnkC/arcgis/rest/services/PotentialPlots/FeatureServer/0"
            var denverLotsLayer = new FeatureLayer(
                featureLayerURL,
                {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: [
                        //Land Use
                        "CPD_LU_I",
                        //Lot Size
                        "Shape_Area",
                        //Soil Type
                        "L1_SOILTYP",
                        //Approximate Location
                        "APPROX_LOC"
                    ]
                });
            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID, 
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID, 
                    new Color([255,255,255,0.35]), 
                    1
                ),
                new Color([117,90,43,0.75])
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
                var dialogHTML = getDialogHTML();
                //console.log("DIALOG HTML", dialogHTML);
                //console.dir(evt.graphic.geometry);
                var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
                map.graphics.add(highlightGraphic);
                highlightGraphic.attributes = evt.graphic.attributes;

                var content = esriLang.substitute(evt.graphic.attributes, dialogHTML);
                var json = esriLang.substitute(evt.graphic.attributes, makeInfoJSON());
                json = JSON.parse(json);
                console.dir(this);
                dialog.setContent(content);
                //console.dir(evt.graphic);
                console.dir(this);
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
            map.on("click",function(evt){
                if(evt.graphic.attributes){
                    console.log("Clicked:"+evt.graphic.attributes.APPROX_LOC);
                    topic.publish("map/selection",evt.graphic.attributes);
                }
            });
            //END OF POTENTIAL PLOTS
            
            //BEGIN URBAN GARDENS
            
            var gardenUrl = "https://maps.google.com/maps/ms?hl=en&ie=UTF8&source=embed&dg=feature&authuser=0&msa=0&output=kml&msid=211918099394035570605.000456f1e9657b8060c21 ";
                
            var kml = new esri.layers.KMLLayer(gardenUrl); 
             map.addLayer(kml);


            function closeDialog() {
                map.graphics.clear();
                dijitPopup.close(dialog);

            };

            function makeInfoJSON() {
                var json = "{";
                var fields = [
                    {
                        objName : "landUse",
                        tableName: "${CPD_LU_I:String}"
                    },
                    {
                        objName : "area",
                        tableName : "${Shape_Area:NumberFormat}"
                    },
                    {
                        objName : "soilType",
                        tableName : "${L1_SOILTYP:String}"
                    }

                ];

                for(var i = 0; i < fields.length; i++){
                    var field = fields[i];
                    if(i === fields.length - 1){
                        json += '"'+field.objName+'":"'+field.tableName+'"'; 
                    } else {
                        json += '"'+field.objName+'":"'+field.tableName+'", ';

                    }

                }
                json += "}";
                return json;
            };

            function getDialogHTML() {
                var html = "";
                var fields = [
                    {
                        label: "Approximate Location",
                        tableName: "${APPROX_LOC:String}"
                    },
                    {
                        label: "Land Use",
                        tableName: "${CPD_LU_I:String}"
                    },
                    {
                        label: "Lot Area",
                        tableName : "${Shape_Area:NumberFormat} sq/ft"
                    },
                    {
                        label: "Soil Type",
                        tableName : "${L1_SOILTYP:String}"
                    }
                    

                ]
                html += "<h1>Lot Information</h1>";
                html += "<div class='lotPopupDiv'>"
                for(var i = 0; i < fields.length; i++){
                    var field = fields[i];
                    html += "<span class='lotPopupLabel'>"+field.label+": </span><br><span class='lotPopupText'>"+field.tableName+"</span><br><br>";
                }

                html+="</div>"
                return html;

            }

        });



});
