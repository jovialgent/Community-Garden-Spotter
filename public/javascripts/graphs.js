/**
 * Created by Marc on 5/31/14.
 */

$(function(){

    // EMXT - Extreme maximum daily temperature
    // MMNT - Monthly Mean minimum temperature
    // EMNT - Extreme minimum daily temperature
    // TSNW - Total snow fall
    // TPCP - Total precipitation
    // MNTM - Monthly mean temperature
    // MMXT - Monthly Mean maximum temperature
    //YearMonth, TPCP,	TSNW,	EMXT,	EMNT,	MMXT,	MMNT,	MNTM,
    var noaaData = [
            {month:201301,TPCP:24,TSNW:25,EMXT:67,EMNT:-7,MMXT:451,MMNT:142,MNTM:296},
            {month:201302,TPCP:67,TSNW:102,EMXT:63,EMNT:3,MMXT:436,MMNT:173,MNTM:304},
            {month:201303,TPCP:143,TSNW:167,EMXT:76,EMNT:2,MMXT:505,MMNT:234,MNTM:370},
            {month:201304,TPCP:110,TSNW:109,EMXT:81,EMNT:6,MMXT:549,MMNT:288,MNTM:419},
            {month:201305,TPCP:124,TSNW:23,EMXT:89,EMNT:27,MMXT:705,MMNT:444,MNTM:574},
    {month:201306,TPCP:41,TSNW:0,EMXT:100,EMNT:43,MMXT:866,MMNT:540,MNTM:703},
    {month:201307,TPCP:349,TSNW:0,EMXT:101,EMNT:54,MMXT:869,MMNT:601,MNTM:735},
    {month:201308,TPCP:158,TSNW:0,EMXT:97,EMNT:53,MMXT:876,MMNT:585,MNTM:731},
    {month:201309,TPCP:1389,TSNW:0,EMXT:95,EMNT:35,MMXT:789,MMNT:539,MNTM:664},
    {month:201310,TPCP:62,TSNW:12,EMXT:81,EMNT:27,MMXT:595,MMNT:352,MNTM:473},
    {month:201311,TPCP:20,TSNW:19,EMXT:70,EMNT:12,MMXT:550,MMNT:262,MNTM:406},
    {month:201312,TPCP:27,TSNW:39,EMXT:68,EMNT:-10,MMXT:428,MMNT:148,MNTM:288}];



    $.ajax("http://api.openweathermap.org/data/2.5/forecast/daily?q=Denver&mode=json&cnt=7&units=imperial", {dataType:"json"}).then(function(data){
        console.log("Weather data loaded.");
        var flattenedTemps = [];
        var HOURS_TO_MS = 1000*60*60;
        data.list.forEach(function(item){
            item.date = new Date(item.dt * 1000 + 12* HOURS_TO_MS);
            var dtInMs = item.dt * 1000;
            flattenedTemps.push({date:new Date(dtInMs + HOURS_TO_MS),temperature:item.temp.morn});
            flattenedTemps.push({date:new Date(dtInMs + 6* HOURS_TO_MS),temperature:item.temp.day});
            flattenedTemps.push({date:new Date(dtInMs + 12* HOURS_TO_MS),temperature:item.temp.eve});
            flattenedTemps.push({date:new Date(dtInMs + 18* HOURS_TO_MS),temperature:item.temp.night});
            item.high = item.temp.max;
            item.low = item.temp.min;
            item.avg = (item.temp.morn + item.temp.day + item.temp.eve + item.temp.night)/4;
            item.rain = (item.rain)?item.rain:0;
        });
        //drawForecastHighLowAvg(data.list);
        drawForecast(flattenedTemps);
        drawPrecip(data.list);
    });
    var drawForecast = function(data){
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(7)
            .tickFormat(d3.time.format("%A"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line().interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.temperature); });

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain(d3.extent(data, function(d) { return d.temperature; }));

        var svg = d3.select("#weatherForecast").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature (\u00b0F)");
        var formatTime = d3.time.format("%e %B");
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);



    };


    var drawForecastHighLowAvg = function (data) {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(7)
            .tickFormat(d3.time.format("%A"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line().interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.temperature); });
        var color = d3.scale.category10();
        color.domain(d3.keys({high:"high",low:"low",avg:"avg"}));

        var tempRanges = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {date: d.date, temperature: +d[name]};
                })
            };
        });

        var svg = d3.select("#weatherForecast").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([
            d3.min(tempRanges, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
            d3.max(tempRanges, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature (\u00b0F)");

        var tempSeries = svg.selectAll(".tempSeries")
            .data(tempRanges)
            .enter().append("g")
            .attr("class", "tempSeries");

        tempSeries.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        tempSeries.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
    };

    var drawPrecip = function(data){
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 500 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(7)
            .tickFormat(d3.time.format("%A"));

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
            y.domain([0, d3.max(data, function(d) { return d.rain; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Rain");

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.date); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.rain); })
                .attr("height", function(d) { return height - y(d.rain); });
    };
});