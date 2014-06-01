
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');


//var API_USER = "????";
//var API_KEY = "????";
//var sendgrid = require('sendgrid')(API_USER,API_KEY);





var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);
app.use(express.favicon('cgp_favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);



app.get('/what-to-plant', function (req, res) {
    var currentMonth = (new Date()).getMonth();
    var toPlant = [];
    if(currentMonth == 2){
        toPlant = [    {
            "PlantType":"Peas",
            "Season":"Cool",
            "Hardiness":"Hardy",
            "DaysToHarvest":"65",
            "PlantSpacing":"4-6",
            "PlantingDepth":"1",
            "Watering":"Moderate"
        }];
    }
    if(currentMonth == 3){
        toPlant = [   {
                "PlantType":"Carrots",
                "Season":"Cool",
                "Hardiness":"Semi-Hardy",
                "DaysToHarvest":"70",
                "PlantSpacing":"2-3",
                "PlantingDepth":"1/4",
                "Watering":"Low"
            },
            {
                "PlantType":"Beets",
                "Season":"Cool",
                "Hardiness":"Semi-Hardy",
                "DaysToHarvest":"60",
                "PlantSpacing":"4-6",
                "PlantingDepth":"3/4- 1",
                "Watering":"Low"
            },
            {
                "PlantType":"Potatoes",
                "Season":"Cool",
                "Hardiness":"Semi-Hardy",
                "DaysToHarvest":"125",
                "PlantSpacing":"12-15",
                "PlantingDepth":"4-6",
                "Watering":"High"
            },
            {
                "PlantType":"Lettuce",
                "Season":"Cool",
                "Hardiness":"Hardy",
                "DaysToHarvest":"60",
                "PlantSpacing":"7-9",
                "PlantingDepth":"1/4",
                "Watering":"Low"
            },
            {
                "PlantType":"Onions",
                "Season":"Cool",
                "Hardiness":"Hardy",
                "DaysToHarvest":"110",
                "PlantSpacing":"4-6",
                "PlantingDepth":"1/4",
                "Watering":"High"
            },
            {
                "PlantType":"Spinach",
                "Season":"Cool",
                "Hardiness":"Hardy",
                "DaysToHarvest":"40",
                "PlantSpacing":"4-6",
                "PlantingDepth":"1/2",
                "Watering":"Low"
            },
            {
                "PlantType":"Broccoli",
                "Season":"Cool",
                "Hardiness":"Hardy",
                "DaysToHarvest":"65",
                "PlantSpacing":"18",
                "PlantingDepth":"1/2",
                "Watering":"High"
            },
            {
                "PlantType":"Radish",
                "Season":"Cool",
                "Hardiness":"Hardy",
                "DaysToHarvest":"30",
                "PlantSpacing":"2-3",
                "PlantingDepth":"1/2",
                "Watering":"Low"
            },
            {
                "PlantType":"Turnips",
                "Season":"Cool",
                "Hardiness":"Hardy",
                "DaysToHarvest":"50",
                "PlantSpacing":"4-6",
                "PlantingDepth":"1/2",
                "Watering":"Low"
            },];
    }
    if(currentMonth == 5 || currentMonth == 6){
        toPlant =[
            {
                "PlantType":"Cucumbers",
                "Season":"Warm",
                "Hardiness":"Tender",
                "DaysToHarvest":"55",
                "PlantSpacing":"6 trellised 24-36 untrellised",
                "PlantingDepth":"1",
                "Watering":"High"
            },
            {
                "PlantType":"Tomatoes",
                "Season":"Warm",
                "Hardiness":"Very Tender",
                "DaysToHarvest":"65",
                "PlantSpacing":"24",
                "PlantingDepth":"1/4",
                "Watering":"High"
            },
            {
                "PlantType":"Peppers",
                "Season":"Warm",
                "Hardiness":"Very Tender",
                "DaysToHarvest":"70",
                "PlantSpacing":"15-18",
                "PlantingDepth":"1/4",
                "Watering":"High"
            },
            {
                "PlantType":"Cantaloupe",
                "Season":"Warm",
                "Hardiness":"Very Tender",
                "DaysToHarvest":"85",
                "PlantSpacing":"36-48",
                "PlantingDepth":"1-1 1/2",
                "Watering":"Moderate"
            },
            {
                "PlantType":"Watermelon",
                "Season":"Warm",
                "Hardiness":"Very Tender",
                "DaysToHarvest":"85",
                "PlantSpacing":"36-48",
                "PlantingDepth":"1-1 1/2",
                "Watering":"Low"
            },
            {
                "PlantType":"Beans",
                "Season":"Warm",
                "Hardiness":"Tender",
                "DaysToHarvest":"60",
                "PlantSpacing":"6",
                "PlantingDepth":"1-1 1/2",
                "Watering":"Moderate"
            },
            {
                "PlantType":"Pumpkins",
                "Season":"Warm",
                "Hardiness":"Very Tender",
                "DaysToHarvest":"85",
                "PlantSpacing":"36-48",
                "PlantingDepth":"1-1 1/2",
                "Watering":"High"
            },
            {
                "PlantType":"Corn",
                "Season":"Warm",
                "Hardiness":"Tender",
                "DaysToHarvest":"60-90",
                "PlantSpacing":"12 x 30 or 9 x 36",
                "PlantingDepth":"1-1 1/2",
                "Watering":"High"
            },
            {
                "Plant Type":"Eggplant",
                "Season":"Warm",
                "Hardiness":"Very Tender",
                "DaysToHarvest":"60",
                "PlantSpacing":"18-24",
                "PlantingDepth":"1/4",
                "Watering":"High"
            }
        ];
    }

    res.send(JSON.stringify(toPlant));
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
