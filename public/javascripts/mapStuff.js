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
            "esri/dijit/Legend",
            "esri/layers/FeatureLayer",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol", 
            "esri/renderers/SimpleRenderer",
            "esri/Color",
            "esri/graphic",
            "esri/lang",
            "esri",
            "esri/geometry/Extent", 
            "esri/renderers/DotDensityRenderer", 
            "esri/renderers/ScaleDependentRenderer",
            "dojo/_base/array",

            //DOJO CODE
            "dojo/dom-style", 
            
            "dijit/TooltipDialog",
            "dijit/popup",
            "dojo/topic",
            "dijit/layout/ContentPane", 
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
             Legend,
             FeatureLayer,
             Tiled,
             SimpleFillSymbol,
             SimpleLineSymbol,
             SimpleRenderer,
             Color,
             Graphic,
             esriLang,
             esri,
             Extent,
             DotDensityRenderer,
             ScaleDependentRenderer,
             arrayUtils,   

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
                    basemap: "gray",

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
                var foodStoreUrl = "http://services3.arcgis.com/Msac6VmgidYoGnkC/arcgis/rest/services/Census2010/FeatureServer/0";
                var foodStore = new FeatureLayer(
                    foodStoreUrl,
                    {
                        id:"popDD",
                        mode:FeatureLayer.MODE_SNAPSHOT,
                        outFields:[
                            "POPULATION",

                        ]
                    }
                )
                //foodStore.setDefinitionExpression("POPULATION>10000");
                //console.dir(foodStore);
                var popRenderer = new DotDensityRenderer({
                    dotShape: "circle",

                    fields : [
                        {
                            name : "POPULATION",
                            color : new Color([45,208,157,0.33])

                        }
                    ],
                    dotValue: 10,
                    dotSize : 10
                })



                foodStore.setRenderer(popRenderer);

                map.addLayer(foodStore);
                map.getLayer('popDD').hide();


                //BEGIN Potential plots
                var featureLayerURL = "http://services3.arcgis.com/Msac6VmgidYoGnkC/arcgis/rest/services/PotPlots/FeatureServer/0"
                var denverLotsLayer = new FeatureLayer(
                    featureLayerURL,
                    {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: [
                            //Land Use
                            "CPD_LU_II",
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


                var legendDijit = new Legend({
                    map: map
                }, "legendDiv");
                legendDijit.startup();


                //close the dialog when the mouse leaves the highlight graphic
                map.on("load", function(){
                    map.graphics.enableMouseEvents();
                    map.graphics.on("mouse-out", closeDialog);

                });


                denverLotsLayer.on("mouse-over", function(evt){
                    //dialog.setContent("<h1>Works</h1>");
                    var lotCost = Math.round(evt.graphic.attributes.Shape_Area * .46);
                    var dialogHTML = getDialogHTML(lotCost);
                    //console.log("DIALOG HTML", dialogHTML);
                    //console.dir(evt.graphic.geometry);
                    var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
                    map.graphics.add(highlightGraphic);
                    highlightGraphic.attributes = evt.graphic.attributes;

                    var content = esriLang.substitute(evt.graphic.attributes, dialogHTML);
                    var json = esriLang.substitute(evt.graphic.attributes, makeInfoJSON());
                    json = JSON.parse(json);

                    dialog.setContent(content);
                    //console.dir(evt.graphic);
                    //console.dir(this);
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

                var gardenUrl = "http://services3.arcgis.com/Msac6VmgidYoGnkC/ArcGIS/rest/services/DenUrbGardens/FeatureServer/0";

                var kml = new FeatureLayer(
                    gardenUrl,
                    {
                        id : "dug",
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: [
                            "Name"
                        ]
                    }); 
                map.addLayer(kml);
                map.getLayer("dug").hide();
                
                $('#dug').click(function(evt){
                    if(map.getLayer('dug').visible){
                        map.getLayer('dug').hide();
                    } else {
                        map.getLayer('dug').show();
                    }


                    $(this).toggleClass('selectLayer');
                });

                var ecoregionsUrl = "http://services3.arcgis.com/Msac6VmgidYoGnkC/arcgis/rest/services/EcoregionsIV/FeatureServer/0";

                var ecoregions = new FeatureLayer(
                    ecoregionsUrl,
                    {
                        mode: FeatureLayer.MODE_SNAPSHOT,
                        outFields: [
                            "US_L4NAME"
                        ]
                    }); 
                //map.addLayer(ecoregions);



                //foodStore.hide();



                $('#population').click(function(evt){
                    if(map.getLayer('popDD').visible){
                        map.getLayer('popDD').hide();
                    } else {
                        map.getLayer('popDD').show();
                    }


                    $(this).toggleClass('selectLayer');
                });

                //map.addLayer([denverLotsLayer, foodStore]);


                function closeDialog() {
                    map.graphics.clear();
                    dijitPopup.close(dialog);

                };

                function makeInfoJSON() {
                    var json = "{";
                    var fields = [
                        {
                            objName : "landUse",
                            tableName: "${CPD_LU_II:String}"
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

                function getDialogHTML(cost) {
                    var html = "";
                    var fields = [
                        {
                            label: "Approximate Location",
                            tableName: "${APPROX_LOC:String}"
                        },
                        {
                            label: "Land Use",
                            tableName: "${CPD_LU_II:String}"
                        },
                        {
                            label:"Development Cost",
                            tableName : "$" + cost + ".00"
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
