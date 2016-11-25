document.addEventListener("DOMContentLoaded", function(event) {		
	var margin = {top: 20, left: 50, right: 20, bottom: 40},
		width = 870 - margin.left - margin.right,
		height = 520 - margin.top - margin.bottom,
		graph = d3.select("#graph"),
		g = graph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	graph.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
	
	
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
	
	
	var drawGraph = function() {
		g.append("g")
			.attr("class", "points")
			.selectAll("circle")
			.data(d[firstCountry].maleData)
			.enter().append("circle")
				.attr("class", "point")
				.classed("male", function(d) { return d.sex_id === "1"; })
				.classed("female", function(d) { return d.sex_id === "2"; })
				.classed("both", function(d) { return d.sex_id === "3"; })
				.attr("r", "3px")
				.attr("cx", function(d) { return x(d.year); })
				.attr("cy", function(d) { return y(d.mean); });
	}
	
	//Data setup
	var d = {},
		firstCountry = "Global",
		firstGenders = {male: true, female: true, both: true},
		secondCountry = "United States"
		secondGenders = {male: true, female: true, both: true};
	
	
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
						name: data[r].location_name,
						bothData: [],
						maleData: [],
						femaleData: []
					}
				} else {
					if (data[r].sex == "male")
						d[data[r].location_name].maleData.push(data[r])
					else if (data[r].sex == "female")
						d[data[r].location_name].femaleData.push(data[r])
					else if (data[r].sex == "both")
						d[data[r].location_name].bothData.push(data[r])
				}
			}
			
			drawGraph(data);
		}
	});
});