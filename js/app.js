//brendan bow 

//variable declaration
var d3;
var streets = [];
var pumps;
var deathDays;
var deathDetails;
var w = 1250;
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
var ageChart = d3.select('svg').append('g').attr('class', 'ageChart');

d3.csv("data/deaths_age_sex.csv", function (data) {
    window.deathDetails = data;
    //console.log(deathDetails);
    mapDeaths(deathDetails);
    chartGender(deathDetails);
    chartAge(deathDetails);
});


function mapDeaths(deathDetails) {
    clearDeaths();
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
            .attr("r", "4")
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("class", "deathDetails")
            .attr("fill", function (d) {
                console.log
                if (document.querySelector('input[name="grouping"]:checked').value === "none") {
                    return "red";
                } else if (document.querySelector('input[name="grouping"]:checked').value === "gender") {
                    if (d.gender === "1") {
                        return "coral";
                    } else if (d.gender === "0") {
                        return "purple";
                    }
                } else if (document.querySelector('input[name="grouping"]:checked').value === "age") {
                    if (d.age === "0") {
                        return "#FFFFFF";
                    } else if (d.age === "1") {
                        return "#ccece6";
                    } else if (d.age === "2") {
                        return "#99d8c9";
                    } else if (d.age === "3") {
                        return "#66c2a4";
                    } else if (d.age === "4") {
                        return "#2ca25f";
                    } else if (d.age === "5") {
                        return "#006d2c";
                    }
                }
                ;
            })
            .attr("gender", function (d) {
                return (d.gender);
            })
            .attr("age", function (d) {
                return (d.age);
            })
            .transition()
            .duration(100);
}

//puts the death graph on the page
function drawLineChart() {
    var maxValue = 150;
    maxValue = d3.max(deathDays, function (d) {
        return Number(d.deaths);
    });
    var xScale = d3.scale.linear();
    var yScale = d3.scale.linear();
    var timeScale = d3.scale.linear();



    xScale.domain([0, 41]).range([0, 400]);
    yScale.domain([0, maxValue]).range([300, 0]);
    timeScale.domain([0, 400]).range([0, 41]);

    timeline.append('rect')
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "400")
            .attr("height", "300")
            .attr("fill", "lightgrey")
            .attr("stroke", "none")
            .attr("class", "backing")
            .attr("style", "opacity: \"0.05\"")
            .attr('pointer-events', 'all')
            .on('mousemove', function () {
                clearDeaths();
                subset = [];
                mousedDay = Math.floor(timeScale(d3.mouse(this)[0]));
                todayCount = (deathDays[Math.floor(timeScale((d3.mouse(this)[0])))]).deaths;
                timeline.selectAll("line.pointer").remove();

                timeline.append('line')
                        .attr("x1", Math.floor((d3.mouse(this)[0])))
                        .attr("y1", "0")
                        .attr("x2", Math.floor((d3.mouse(this)[0])))
                        .attr("y2", "300")
                        .attr("class", "pointer")
                        .attr("stroke", "red")
                        .attr("stroke-width", "2");

                timeline.append('line')
                        .attr("x1", "0")
                        .attr("y1", yScale(todayCount))
                        .attr("x2", "400")
                        .attr("y2", yScale(todayCount))
                        .attr("class", "pointer")
                        .attr("stroke", "red")
                        .attr("stroke-width", "2");

                //console.log(window.deathDetails)
                console.log(mousedDay);
                console.log(deathDays[Math.floor(timeScale((d3.mouse(this)[0])))].i);

                total = 0;
                for (q = 0; q < mousedDay; q++) {
                    //subset.push(((q+1) * deathDays[q].deaths));
                    console.log(deathDays[q].deaths);
                    total += Number(deathDays[q].deaths);
                    console.log(total);
                }
                subset = deathDetails.slice(0, total);
                console.log(subset);

                mapDeaths(subset);

            })
            .on('mouseout', function (d) {
                timeline.selectAll("line.pointer").remove();
                subset = [];
                tota = 0;
              //  clearDeaths();
                mapDeaths(deathDetails);
            });

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
            });

    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

    timeline.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + 300 + ')')
            .call(xAxis);

    timeline.append('g')
            .attr('class', 'axis')
            .call(yAxis);

    timeline.append('path')
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '3px')
            .attr('d', pathGenerator(deathDays));

    timeline.append('text')
            .text("Days Since August 19th, 1854")
            .style('font-size', '11px')
            .attr('transform', 'translate(' + 105 + ',' + 335 + ')');

    timeline.append('text')
            .text("Deaths")
            .style('font-size', '11px')
            .attr('transform', 'translate(' + "-30" + ',' + 180 + ') rotate(' + 270 + ')');
}

//death data
d3.csv("data/deathdays.csv", function (data) {
    deathDays = data;
    drawLineChart(deathDays);
    timeline.attr('transform', 'translate(' + 750 + ',' + 25 + ')');

});

//puts the deaths on the page


function chartGender(deathDetails) {

    var margin = {
        left: 10
    };

    sexChart.attr('transform', 'translate(' + 750 + ',' + 400 + ')');

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
    var barxScale = d3.scale.ordinal();
    var baryScale = d3.scale.linear();

    barxScale.domain(["Male", "Female"]).range([0, 50]);
    baryScale.domain([0, maxCount]).range([200, 0]);


    var barxAxis = d3.svg.axis()
            .scale(barxScale)
            .orient('bottom');

    var baryAxis = d3.svg.axis()
            .scale(baryScale)
            .orient('left');

    sexChart.append('g')
            .attr('class', 'axis')
            .attr("transform", "translate(" + margin.left + "," + (200) + ")")
            .call(barxAxis);

    sexChart.append('g')
            .attr('class', 'axis')
            .call(baryAxis);

    sexChart.selectAll("rect")
            .data([maleCount, femaleCount])
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return barxScale(i);
            })
            .attr("y", function (d) {
                return baryScale(d);
            })
            .attr("width", 20)
            .attr("fill", function (d, i) {
                if (i === 0) {
                    return "purple";
                } else if (i === 1) {
                    return "coral";
                }
            })
            .attr("height", function (d, i) {
                return (baryScale(0) - baryScale(d));
            })
            .attr("stroke", "black")
            .attr("class", "bar");


    sexChart.append('text')
            .text("Deaths")
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .attr('transform', 'translate(' + "-35" + ',' + 120 + ') rotate(' + 270 + ')');

}

function chartAge(deathDetails) {

    var margin = {
        left: 20
    };
    ageChart.attr('transform', 'translate(' + 900 + ',' + 400 + ')');
    var kidCount = 0;
    var teenCount = 0;
    var youngAdultCount = 0;
    var adultCount = 0;
    var retireeCount = 0;
    var seniorCount = 0;
    for (var a = 0; a < deathDetails.length; a++) {
        if (deathDetails[a].age === "0") {
            kidCount++;
        } else if (deathDetails[a].age === "1") {
            teenCount++;
        } else if (deathDetails[a].age === "2") {
            youngAdultCount++;
        } else if (deathDetails[a].age === "3") {
            adultCount++;
        } else if (deathDetails[a].age === "4") {
            retireeCount++;
        } else if (deathDetails[a].age === "5") {
            seniorCount++;
        }
    }

    var maxCount = 100;
    maxCount = d3.max([kidCount, teenCount, youngAdultCount, adultCount, retireeCount, seniorCount]);
    var agexScale = d3.scale.ordinal();
    var ageyScale = d3.scale.linear();
    agexScale.domain(["0-10", "11-20", "21-40", "41-60", "61-80", "81+"]).rangePoints([0, 300]);
    ageyScale.domain([0, maxCount]).range([200, 0]);
    var agexAxis = d3.svg.axis()
            .scale(agexScale)
            .orient('bottom');
    var ageyAxis = d3.svg.axis()
            .scale(ageyScale)
            .orient('left');
    ageChart.append('g')
            .attr('class', 'axis')
            .attr("transform", "translate(" + margin.left + "," + (200) + ")")
            .call(agexAxis);
    ageChart.append('g')
            .attr('class', 'axis')
            .call(ageyAxis);
    ageChart.selectAll("rect")
            .data([kidCount, teenCount, youngAdultCount, adultCount, retireeCount, seniorCount])
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return i * 60;
            })
            .attr("y", function (d) {
                return ageyScale(d);
            })
            .attr("width", 40)
            .attr("fill", function (d, i) {
                if (i === 0) {
                    return "#FFFFFF";
                } else if (i === 1) {
                    return "#CCECE6";
                } else if (i === 2) {
                    return "#99D8C9";
                } else if (i === 3) {
                    return "#66C2A4";
                } else if (i === 4) {
                    return "#2CA25F";
                } else if (i === 5) {
                    return "#006D2C";
                }
            })
            .attr("height", function (d, i) {
                return (ageyScale(0) - ageyScale(d));
            })
            .attr("stroke", "black")
            .attr("class", "bar");

    sexChart.append('text')
            .text("Deaths")
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .attr('transform', 'translate(' + 120 + ',' + 110 + ') rotate(' + 270 + ')');

    sexChart.append('text')
            .text("Age (years)")
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .attr('transform', 'translate(' + 300 + ',' + 235 + ')');
    //changes the deaths by user mousing


    d3.selectAll("rect.bar").on("mouseover", function (d, i) {
//Do something 
        deathMen = [];
        deathWomen = [];
        deathChildren = [];
        deathTeens = [];
        deathYoungAdults = [];
        deathAdults = [];
        deathRetirees = [];
        deathSeniors = [];
        allBars = document.getElementsByClassName("bar");

        for (b = (allBars.length) - 1; b >= 0; b--) {
            allBars[b].style.opacity = "0.5"
            this.style.opacity = "1"
        }

        for (a = 0; a < deathDetails.length; a++) {
            if (deathDetails[a].gender === "0") {
                deathMen.push(deathDetails[a]);
            } else if (deathDetails[a].gender === "1") {
                deathWomen.push(deathDetails[a]);
            }

            if (deathDetails[a].age === "0") {
                deathChildren.push(deathDetails[a]);
            } else if (deathDetails[a].age === "1") {
                deathTeens.push(deathDetails[a]);
            } else if (deathDetails[a].age === "2") {
                deathYoungAdults.push(deathDetails[a]);
            } else if (deathDetails[a].age === "3") {
                deathAdults.push(deathDetails[a]);
            } else if (deathDetails[a].age === "4") {
                deathRetirees.push(deathDetails[a]);
            } else if (deathDetails[a].age === "5") {
                deathSeniors.push(deathDetails[a]);
            }
            ;
        }

        if (this.attributes.fill.nodeValue === "purple") {
            //clearDeaths();
            mapDeaths(deathMen);
        } else if (this.attributes.fill.nodeValue === "coral") {
            //clearDeaths();
            mapDeaths(deathWomen);
        } else if (this.attributes.fill.nodeValue === "#FFFFFF") {
            //clearDeaths();
            mapDeaths(deathChildren);
        } else if (this.attributes.fill.nodeValue === "#CCECE6") {
            //clearDeaths();
            mapDeaths(deathTeens);
        } else if (this.attributes.fill.nodeValue === "#99D8C9") {
            //clearDeaths();
            mapDeaths(deathYoungAdults);
        } else if (this.attributes.fill.nodeValue === "#66C2A4") {
            //clearDeaths();
            mapDeaths(deathAdults);
        } else if (this.attributes.fill.nodeValue === "#2CA25F") {
            //clearDeaths();
            mapDeaths(deathRetirees);
        } else if (this.attributes.fill.nodeValue === "#006D2C") {
            //sclearDeaths();
            mapDeaths(deathSeniors);
        }
        ;
    })
            .on('mouseout', function (d, i) {
                allBars = document.getElementsByClassName("bar");

                for (b = (allBars.length) - 1; b >= 0; b--) {
                    allBars[b].style.opacity = "1"
                }
                clearDeaths();
                mapDeaths(deathDetails);
            });
}

//clears it
function clearDeaths() {
    d3.select("svg").selectAll("circle.deathDetails")
//            .transition()
//            .duration(300)
//            .attr("r", 0)
            .remove();

}

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
                        return "#FFFFFF";
                    } else if (d.age === "1") {
                        return "#ccece6";
                    } else if (d.age === "2") {
                        return "#99d8c9";
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
//    drawLineChart(deathDays);
    map.append('path')
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '2px')
            .attr('d', pathGenerator(streets));
}
