//brendan bow 

//variable declaration
var d3;
var streets = [];
var pumps;
var deathDays;
var deathDetails;
var w = 1500;
var h = 1000;

//magic numbers
var scaleUp = 40;
var slideUp = 245;
var slideRight = 100;
//creation
var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
var map = d3.select('svg').append('g').attr('class', 'map');
var timeline = d3.select('svg').append('g').attr('class', 'timeline');
var sexChart = d3.select('svg').append('g').attr('class', 'sexChart');


//gets the data for the steets and passes it to a drawing function
d3.json("data/streets.json", function (data) {
    var allstreets = data;
    for (var y = 0; y < allstreets.length; y++) {
        streets = [];
        var street = allstreets[y];
        for (var j = 0; j < street.length; j++) {
            var object = {
                x: street[j].x,
                y: street[j].y
            };
            streets.push(object);
        }
        drawMap();
    }
});

//puts the death graph on the page
function drawLineChart()
{
    var maxValue = 150;
    maxValue = d3.max(deathDays, function (d) {
        return Number(d.deaths);
    });
    var xScale = d3.scale.linear();
    var yScale = d3.scale.linear();

    xScale.domain([0, 41]).range([0, 400]);

    yScale.domain([0, maxValue]).range([200, 0]);

    var pathGenerator = d3.svg.line()
            .x(function (d, i) {
                return xScale(i);
            })
            .y(function (d) {
                return yScale(d.deaths);
            });

    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(function (d) {
                return "" + d;
            })

    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

    timeline.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + 200 + ')')
            .call(xAxis);

    timeline.append('g')
            .attr('class', 'axis')
            .call(yAxis);

    timeline.append('path')
            .style('fill', 'none')
            .style('stroke', 'red')
            .style('stroke-width', '3px')
            .attr('d', pathGenerator(deathDays));

    timeline.append('text')
            .text("Days Since August 19th, 1854")
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .attr('transform', 'translate(' + 105 + ',' + 235 + ')');

    timeline.append('text')
            .text("Deaths")
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .attr('transform', 'translate(' + "-30" + ',' + 118 + ') rotate(' + 270 + ')');
}

//death data
d3.csv("data/deathdays.csv", function (data) {
    deathDays = data;
    drawLineChart(deathDays);
    timeline.attr('transform', 'translate(' + 750 + ',' + 25 + ')');

});

//puts the deaths on the page
function mapDeaths(deathDetails) {
    map.selectAll("circle.deathDetails")
            .data(deathDetails)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return ((d.x) * scaleUp) - slideRight;
            })
            .attr("cy", function (d) {
                return (h - d.y * scaleUp) - slideUp;
            })
            .attr("r", "3")
            .attr("class", "deathDetails")
            .attr("fill", "red")
            .attr("gender", function (d) {
                return (d.gender);
            });
}

function chartDeaths(deathDetails) {
    sexChart.attr('transform', 'translate(' + 750 + ',' + 255 + ')');
    var maleCount = 0;
    var femaleCount = 0;
    for (var a = 0; a < deathDetails.length; a++) {
        if (deathDetails[a].gender === "1") {
            maleCount++;
        } else if (deathDetails[a].gender === "0") {
            femaleCount++;
        }
    }

    var maxCount = 290;
    maxCount = d3.max([maleCount, femaleCount]);
    var xScale = d3.scale.linear();
    var yScale = d3.scale.linear();

    //xScale.domain([0, 2]).range([0, 100]);
    yScale.domain([0, maxCount]).range([100, 0]);


    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(function (d) {
                return "" + d;
            });

    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

//    sexChart.append('g')
//            .attr('class', 'axis')
//            .attr('transform', 'translate(0,' + 200 + ')')
//            .call(xAxis);

    sexChart.append('g')
            .attr('class', 'axis')
            .call(yAxis);

    sexChart.selectAll("rect")
            .data(deathDetails)
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return 2 * 21;  //Bar width of 20 plus 1 for padding
            })
            .attr("y", (100 - yScale(maleCount)))
            .attr("width", 20)
            .attr("height", yScale(maleCount));

//    sexChart.append('text')
//            .text("Days Since August 19th, 1854")
//            .style('font-size', '11px')
//            .style('font-weight', 'bold')
//            .attr('transform', 'translate(' + 105 + ',' + 235 + ')');

    sexChart.append('text')
            .text("Deaths")
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .attr('transform', 'translate(' + "-30" + ',' + 118 + ') rotate(' + 270 + ')');

}

//makes the deaths
d3.csv("data/deaths_age_sex.csv", function (data) {
    //console.log(data);
    deathDetails = data;
    console.log(deathDetails);
    mapDeaths(deathDetails);
    chartDeaths(deathDetails);
});

//puts the pumps on the page
function mapPumps(pumps) {
    map.selectAll("circle.pump")
            .data(pumps)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return ((d.x) * scaleUp) - slideRight;
            })
            .attr("cy", function (d) {
                return (h - d.y * scaleUp) - slideUp;
            })
            .attr("r", "5")
            .attr("class", "pump")
            .attr("fill", "yellow");
}

//gets the data on the pumps
d3.csv("data/pumps.csv", function (data) {
    pumps = data;
    mapPumps(pumps);
});

//changes the death colors by user selection
d3.selectAll("input.selection").on("change", function () {
//Do something  on click
    if (this.id === "genderize") {
        d3.select("svg").selectAll("circle.deathDetails")
                .transition()
                .duration(500)
                .attr("fill", function (d) {
                    if (d.gender === "1") {
                        return "coral";
                    } else if (d.gender === "0") {
                        return "purple";
                    }
                });
    } else if (this.id === "agify") {
        d3.select("svg").selectAll("circle.deathDetails")
                .transition()
                .duration(500)
                .attr("fill", function (d) {
                    if (d.age === "0") {
                        return "#edf8fb";
                    } else if (d.age === "1") {
                        return "#ccece6";
                    } else if (d.age === "2") {
                        return "##99d8c9";
                    } else if (d.age === "3") {
                        return "#66c2a4";
                    } else if (d.age === "4") {
                        return "#2ca25f";
                    } else if (d.age === "5") {
                        return "#006d2c";
                    }
                });
    } else if (this.id === "none") {
        d3.select("svg").selectAll("circle.deathDetails")
                .transition()
                .duration(500)
                .attr("fill", "red");
    }
    ;
});


//draws the map
function drawMap() {
    var pathGenerator = d3.svg.line()
            .x(function (d) {
                return ((d.x) * scaleUp) - slideRight;
            })
            .y(function (d) {
                return (h - d.y * scaleUp) - slideUp;
            });
    map.append('path')
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '2px')
            .attr('d', pathGenerator(streets));

    map.append('polygon')
            .attr("class", "workhouse")
            .attr("points", "320,200 360,185 379,230 338,247")
            .style('fill', 'lightgreen')
            .style('stroke', 'black')
            .style('stroke-width', '1px');



    map.append('polygon')
            .attr("class", "brewery")
            .attr("points", "442,270 456,263 472,291 458,300")
            .style('fill', 'lightblue')
            .style('stroke', 'black')
            .style('stroke-width', '1px');

    map.append('text')
            .text("Workhouse")
            .style('font-size', '7.5px')
            .style('font-weight', 'bold')
            .attr('x', '332')
            .attr('y', '228')
            .attr('transform', 'translate(-46,195)rotate(-30 20,40)');

    map.append('text')
            .text("Great Marlborough Street")
            .style('font-size', '7.45px')
            .style('font-weight', 'bold')
            .attr('x', '332')
            .attr('y', '228')
            .attr('transform', 'translate(-168,180)rotate(-30 20,40)');

    map.append('text')
            .text("Brewery")
            .attr('x', '442')
            .attr('y', '270')
            .attr('transform', 'translate(458,-251)rotate(65 20,40)')
            .style('font-size', '7.5px')
            .style('font-weight', 'bold');

    map.append('text')
            .text("Regent Street")
            .attr('x', '442')
            .attr('y', '270')
            .attr('transform', 'translate(181,-195)rotate(60 20,40)')
            .style('font-size', '10px')
            .style('font-weight', 'bold');

    map.append('text')
            .text("Picadilly Street")
            .style('font-size', '7.5px')
            .style('font-weight', 'bold')
            .attr('x', '332')
            .attr('y', '228')
            .attr('transform', 'translate(65,560)rotate(-30 20,40)');

    map.append('text')
            .text("Oxford Street")
            .style('font-size', '8px')
            .style('font-weight', 'bold')
            .attr('x', '332')
            .attr('y', '228')
            .attr('transform', 'translate(-55,-50)rotate(-15 20,40)');
}
