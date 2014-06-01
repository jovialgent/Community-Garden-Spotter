var scripts = [
    //External/Third Party Libraries
    "http://code.jquery.com/jquery-1.10.1.min.js",
    "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
    "http://ajax.cdnjs.com/ajax/libs/underscore.js/1.3.3/underscore-min.js",
    "http://js.arcgis.com/3.9/",
    //User Libraries
    "/javascripts/my.js",
    "/javascripts/mapStuff.js",
    "/javascripts/graphs.js"
];

var stylesheets = [
    
    //Third Party Stylesheets
    "http://js.arcgis.com/3.9/js/esri/css/esri.css",
    
    //User Stylesheets
    "stylesheets/normalize.css",
    "stylesheets/style.css",
    "stylesheets/graphs.css",
    "/assets/fonts/sail_webfontkit/stylesheet.css",
    "/assets/fonts/sf_burlington/stylesheet.css"
]

var mapComponents = [
    "locateButton",
    "basemapToggle",
    "homeButton"

];
   


//Object containing everything for the titlebar
var titleBar = {
    info: {
        headerText : "Community Garden Planner"
    },
    
    style: {
        divClasses : "blue",
        titleHeader : "offWhiteText sailregular"
    },
    
    source : {
        titleImage : "/assets/images/shovelGreen.png"
    }
}

//Object contiaining everything for the navigator
var filterNavigator = {
    info : {
        
    },
    
    style : {
        divClasses : "green"
    
    },
    
    source: {
    
    }
    

}

 



exports.index = function(req, res){
    
    //Object containing all the settings for the 
    //mustache template.
    var templateSettings = {
        titleBar: titleBar,
        filterNavigator: filterNavigator,
        scripts: scripts, 
        stylesheets: stylesheets, 
        title: "Hack4Co App",
        mapComponents : mapComponents
    }
   
    
    res.render('index', templateSettings);
};