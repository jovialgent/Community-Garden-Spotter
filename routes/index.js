var scripts = [
    //External/Third Party Libraries
    "http://code.jquery.com/jquery-1.10.1.min.js",
    "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
    "http://ajax.cdnjs.com/ajax/libs/underscore.js/1.3.3/underscore-min.js",
    "http://js.arcgis.com/3.9/",
    "http://d3js.org/d3.v3.min.js",
    //User Libraries
    "/javascripts/my.js",
    "/javascripts/mapStuff.js"
];

var stylesheets = [
    
    //Third Party Stylesheets
    "http://js.arcgis.com/3.9/js/esri/css/esri.css",
    
    //User Stylesheets
    "stylesheets/normalize.css",
    "stylesheets/style.css"
]

var mapComponents = [
    "locateButton",
    "basemapToggle",
    "homeButton"

];
    



exports.index = function(req, res){
    
    //Object containing all the settings for the 
    //mustache template.
    var templateSettings = {
        scripts: scripts, 
        stylesheets: stylesheets, 
        title: "Hack4Co App",
        mapComponents : mapComponents
    }
   
    
    res.render('index', templateSettings);
};