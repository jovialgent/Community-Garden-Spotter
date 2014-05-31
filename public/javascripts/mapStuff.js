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

            //DOJO CODE
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
         HomeButton



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



        });  

});
