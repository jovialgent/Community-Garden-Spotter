/**
 * Created by Marc on 5/31/14.
 */

$(function(){
    $.ajax("http://api.openweathermap.org/data/2.5/forecast/daily?q=Denver&mode=json&cnt=7&units=imperial", {dataType:"json"}).then(function(data){
        console.log("Weather data loaded.");
        drawForecast(data.list);
    });
    var drawForecast = function (data) {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 700 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%d-%m-%y %X").parse;


        data.forEach(function(item){
            item.date = new Date(item.dt * 1000);
            item.high = item.temp.max;
            item.low = item.temp.min;
        });

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%A"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line().interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.temperature); });
        var color = d3.scale.category10();
        color.domain(d3.keys({high:"high",low:"low"}));

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

        //y.domain(d3.extent(data, function(d) { return d.temp.max; }));

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
            .text("Temperature");

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
});