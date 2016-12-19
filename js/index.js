document.addEventListener("DOMContentLoaded", function(event) {		
	var d = {},
		curLocations = ["Global", "United States"],
		curGenders = [{male: false, female: false, both: true}, {male: false, female: false, both: true}];
	
	var margin = {top: 20, left: 50, right: 20, bottom: 40},
		width = 870 - margin.left - margin.right,
		height = 520 - margin.top - margin.bottom,
		graph = d3.select("#graph"),
		g = graph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	graph.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
	
	var pointGroups = [];
	for (var loc in curLocations) {
		pointGroups.push({});
		for (var gdr in curGenders[loc]) {
			var classes = "points " + gdr + "points loc" + loc + "points";
			pointGroups[loc][gdr] = g.append("g").attr("class", classes);
		}
	}
	
	
	//axes setup
	var x = d3.scaleLinear().rangeRound([0, width]),
		y = d3.scaleLinear().rangeRound([height, 0]);
	x.domain([1989, 2013]);
	y.domain([0, 1]);
	
	var xAxis = d3.axisBottom(x).tickFormat(d3.format("")),
		yAxis = d3.axisLeft(y).tickFormat(d3.format(".0%"));
	
	g.append("g")
		.attr("class", "axis xaxis")
    .attr("transform", "translate(0, " + height + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "axislabel")
			.attr("x", width / 2)
			.attr("y", 20)
			.attr("dy", "0.71em")
			.text("Year");
		
	g.append("g")
		.attr("class", "axis yaxis")
    .attr("transform", "translate(0, 0)")
		.call(yAxis)
		.append("text")
			.attr("class", "axislabel")
			.attr("x", -150)
			.attr("y", -48)
			.attr("dy", "0.71em")
			.attr("transform", "rotate(-90)")
			.text("Mean obesity prevelence");
	
	//graph line setup
	for (var loc in pointGroups) {
		for (var gdr in pointGroups[loc]) {
			var lineFunc = d3.line()
				.x(function(d) { return x(d.year); })
				.y(function(d) { return y(0); });
			var straightLine = [];
			for (var i = 1990; i <= 2013; i++) {
				straightLine.push({year: i});
			}
			pointGroups[loc][gdr].append("path")
				.attr("class", "line " + gdr)
				.attr("d", lineFunc(straightLine));
		}
	}
	
	var updateGraph = function() {
		var checkGender = function(boxId) {
			return document.getElementById(boxId).checked;
		}
		for (var loc in curLocations) {
			for (var gdr in curGenders[loc]) {
				if (curGenders[loc][gdr]) {
					drawGraph(d[curLocations[loc]][gdr + "Data"], gdr, pointGroups[loc][gdr]);
				} else {
					drawGraph([], gdr, pointGroups[loc][gdr]);
				}
			}
		}
	}
	
	var drawGraph = function(data, gender, genderPoints) {
		var transitionDuration = 400;
		
		var circles = genderPoints.selectAll("g.point")
			.data(data);
		circles.transition()
			.duration(transitionDuration)
				.attr("transform", function(d) { return "translate(" + x(d.year) + ", " + y(d.mean) + ")"; })
		var newCircles = circles.enter().append("g")
			.attr("class", "point " + gender)
			.attr("transform", function(d) { return "translate(" + x(d.year) + ", " + height + ")"; });
		newCircles.append("circle")
			.attr("r", "3px")
			.attr("cx", 0)
			.attr("cy", 0);
		var details = newCircles.append("g")
			.attr("class", "pointDetails");
		
		details.append("rect")
			.attr("x", -28)
			.attr("y", -39)
			.attr("width", 56)
			.attr("height", 34);
		var text = details.append("text")
			.attr("x", -28)
			.attr("y", -36)
			.attr("dy", "0.51em");
		text.append("tspan")
			.text(function(d) { return "Year: " + d.year; });
		text.append("tspan")
			.attr("x", -28)
			.attr("dy", "1em")
			.text(function(d) { return "Mean: " + d.mean; });
		text.append("tspan")
			.attr("x", -28)
			.attr("dy", "1em")
			.text(function(d) { return "Upper: " + d.upper; });
		text.append("tspan")
			.attr("x", -28)
			.attr("dy", "1em")
			.text(function(d) { return "Lower: " + d.lower; });
		newCircles.transition()
				.duration(transitionDuration)
				.attr("transform", function(d) { return "translate(" + x(d.year) + ", " + y(d.mean) + ")"; })
				.attr("opacity", 1);

		circles.exit().
			transition()
				.duration(transitionDuration / 2)
				.attr("cy", height)
				.attr("opacity", .1)
				.remove();
		
		var opacity = 1;
		var lineFunc = d3.line()
			.x(function(d) { return x(d.year); })
			.y(function(d) { return y(d.mean); });
		if (data.length == 0) {
			for (var i = 1990; i <= 2013; i++) {
				data.push({
					year: i,
					mean: 0
				});
			}
			opacity = 0;
			transitionDuration = transitionDuration / 2;
		}
		var lines = genderPoints.select("path")
      .datum(data)
			.attr("class", "line " + gender);
		lines.transition()
			.duration(transitionDuration)
			.attr("d", lineFunc)
			.attr("opacity", opacity);
	}
	
	
	var locationUpdate = function(evt) {
		curLocations[+(evt.target.dataset.index)] = evt.target.value;
		updateGraph();
	}
	
	var genderUpdate = function(evt) {
		var index = +(evt.target.dataset.index),
			targetGender = evt.target.dataset.gender;
		curGenders[index][targetGender] = evt.target.checked;
		updateGraph();
	}
	
	var csvPath = "./data/SORTED_FILTERED_IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV";
	d3.csv(csvPath, function(error, data) {
		d3.select("#loadingSpinner").attr("display", "none");
		d3.select("#controls").style("display", "block");
		if (error != null) {
			console.log(error);
		} else {
			for (r in data) {
				if (!d.hasOwnProperty(data[r].location_name)) {
					d[data[r].location_name] = {
						location_name: data[r].location_name,
						bothData: [],
						maleData: [],
						femaleData: []
					}
				}
				
				if (data[r].sex == "male")
					d[data[r].location_name].maleData.push(data[r])
				else if (data[r].sex == "female")
					d[data[r].location_name].femaleData.push(data[r])
				else if (data[r].sex == "both")
					d[data[r].location_name].bothData.push(data[r])
			}
			
			//setup country select
			var dArray = Object.keys(d).map(function (key) {return d[key]});
			var select = d3.selectAll(".locationSelect"),
				options = select.selectAll("option").data(dArray);
			
			options.enter().append("option")
				.attr("value", function(d) { return d.location_name; })
				.text(function(d) { return d.location_name; });
			options.exit().remove();
			
			for (var loc in curLocations) {
				var ind = Number(loc),
					selectElem = document.getElementById("locationSelect" + ind);
				selectElem.value = curLocations[loc];
				selectElem.addEventListener("change", locationUpdate);
				
				for (var gdr in curGenders[loc]) {
					var boxElem = document.getElementById(gdr + ind + "Box");
					boxElem.checked = curGenders[loc][gdr];
					boxElem.addEventListener("change", genderUpdate);
				}
			}
			
			updateGraph();
		}
	});
});