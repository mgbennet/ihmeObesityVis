document.addEventListener("DOMContentLoaded", function(event) {		
	var margin = {top: 20, left: 50, right: 20, bottom: 40},
		width = 870 - margin.left - margin.right,
		height = 520 - margin.top - margin.bottom,
		graph = d3.select("#graph"),
		g = graph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	graph.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
	
	var male1G = g.append("g").attr("class", "points malepoints loc1points"),
		female1G = g.append("g").attr("class", "points femalepoints loc1points"),
	  both1G = g.append("g").attr("class", "points bothpoints loc1points"),
		male2G = g.append("g").attr("class", "points malepoints loc2points"),
		female2G = g.append("g").attr("class", "points femalepoints loc2points"),
	  both2G = g.append("g").attr("class", "points bothpoints loc2points");
	
	
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
			.attr("y", -45)
			.attr("dy", "0.71em")
			.attr("transform", "rotate(-90)")
			.text("Mean obesity prevelence");
	
	
	var updateGraph = function() {
		var checkGender = function(boxId) {
			return document.getElementById(boxId).checked;
		}
		
		if (checkGender("male1Box")) {
			drawGraph(d[curLocations[0]].maleData, "male", male1G);
		} else {
			drawGraph([], "male", male1G);
		}
		if (checkGender("female1Box")) {
			drawGraph(d[curLocations[0]].femaleData, "female", female1G);
		} else {
			drawGraph([], "female", female1G);
		}
		if (checkGender("both1Box")) {
			drawGraph(d[curLocations[0]].bothData, "both", both1G);
		} else {
			drawGraph([], "both", both1G);
		}
			
	}
	
	var drawGraph = function(data, gender, genderPoints) {
		var circles = genderPoints.selectAll("circle")
			.data(data)
			.attr("cx", function(d) { return x(d.year); })
			.attr("cy", function(d) { return y(d.mean); });
		circles.enter().append("circle")
				.attr("class", "point " + gender)
				.attr("r", "3px")
				.attr("cx", function(d) { return x(d.year); })
				.attr("cy", function(d) { return y(d.mean); });
		circles.exit().remove();
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
	
	//Data setup
	var d = {},
		curLocations = ["Global", "United States"],
		curGenders = [{male: true, female: true, both: true}, {male: true, female: true, both: true}];
	
	
	var csvPath = "../data/FILTERED_IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV";
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
			options.exit();
			
			for (var i in curLocations) {
				var ind = Number(i) + 1
				document.getElementById("locationSelect" + ind).addEventListener("change", locationUpdate);
				for (var g in curGenders[0]) {
					document.getElementById(g + ind + "Box").addEventListener("change", genderUpdate);
				}
			}
			
			updateGraph();
		}
	});
});