/**
 * Created by Marc on 5/31/14.
 */

$(function(){


    $.ajax("/what-to-plant",{dataType:"json"}).then(function(data){
        var whatToPlant = $("#whatToPlant");
        var html = "<table style='font-size: 80%'><caption>What to Plant This Month</caption>";
        html += "<tr><th>Type</th><th>Hardiness</th><th>Plant Spacing</th><th>Watering</th></tr>"
        for(var ii = 0; ii < data.length; ii++ ){
            var plant = data[ii];
            html+="<tr><td>"+plant.PlantType+"</td><td>"+plant.Hardiness+"</td><td>"+plant.PlantSpacing+"</td><td>"+plant.Watering+"</td></tr>";
        }
        html+="</table>";
        whatToPlant.html(html);
    });

    // EMXT - Extreme maximum daily temperature
    // MMNT - Monthly Mean minimum temperature
    // EMNT - Extreme minimum daily temperature
    // TSNW - Total snow fall
    // TPCP - Total precipitation
    // MNTM - Monthly mean temperature
    // MMXT - Monthly Mean maximum temperature
    //YearMonth, TPCP,	TSNW,	EMXT,	EMNT,	MMXT,	MMNT,	MNTM,
    var noaaData = [
            {date:new Date(2013,0,1),TPCP:24,TSNW:25,EMXT:67,EMNT:-7,MMXT:451,MMNT:142,MNTM:296},
            {date:new Date(2013,01,1),TPCP:67,TSNW:102,EMXT:63,EMNT:3,MMXT:436,MMNT:173,MNTM:304},
            {date:new Date(2013,02,1),TPCP:143,TSNW:167,EMXT:76,EMNT:2,MMXT:505,MMNT:234,MNTM:370},
            {date:new Date(2013,03,1),TPCP:110,TSNW:109,EMXT:81,EMNT:6,MMXT:549,MMNT:288,MNTM:419},
            {date:new Date(2013,04,1),TPCP:124,TSNW:23,EMXT:89,EMNT:27,MMXT:705,MMNT:444,MNTM:574},
            {date:new Date(2013,05,1),TPCP:41,TSNW:0,EMXT:100,EMNT:43,MMXT:866,MMNT:540,MNTM:703},
            {date:new Date(2013,06,1),TPCP:349,TSNW:0,EMXT:101,EMNT:54,MMXT:869,MMNT:601,MNTM:735},
            {date:new Date(2013,07,1),TPCP:158,TSNW:0,EMXT:97,EMNT:53,MMXT:876,MMNT:585,MNTM:731},
            {date:new Date(2013,08,1),TPCP:636,TSNW:0,EMXT:95,EMNT:35,MMXT:789,MMNT:539,MNTM:664},
            {date:new Date(2013,9,1),TPCP:62,TSNW:12,EMXT:81,EMNT:27,MMXT:595,MMNT:352,MNTM:473},
            {date:new Date(2013,10,1),TPCP:20,TSNW:19,EMXT:70,EMNT:12,MMXT:550,MMNT:262,MNTM:406},
            {date:new Date(2013,11,1),TPCP:27,TSNW:39,EMXT:68,EMNT:-10,MMXT:428,MMNT:148,MNTM:288}];

    var drawHighLow = function(data){

        var margin = {top: 30, right: 20, bottom: 30, left: 70},
            width = 500 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(13)
            .tickFormat(d3.time.format("%b"));;

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area().interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y0(function(d) { return y(d.EMNT); })
            .y1(function(d) { return y(d.EMXT); });

        var line = d3.svg.line().interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.MNTM/10); });

        var svg = d3.select("#monthlyHighLow").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([d3.min(data, function(d) { return d.EMNT; }),
                  d3.max(data, function(d) { return d.EMXT; })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .style("fill",function(){return "#5e89d2"});

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("x", 55)
            .attr("y",-20)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature (\u00b0F)");
    };
    drawHighLow(noaaData);

    var drawPrecip = function(data){
        var margin = {top: 30, right: 20, bottom: 30, left: 70},
            width = 500 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(12)
            .tickFormat(d3.time.format("%b"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5, "");

        var svg = d3.select("#weatherPrecip").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            x.domain(data.map(function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.TPCP; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(0)")
                .attr("x", 20)
                .attr("y",-20)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Rainfall (in)");

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.date); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.TPCP); })
                .attr("height", function(d) { return height - y(d.TPCP); });
    };
    drawPrecip(noaaData);
});