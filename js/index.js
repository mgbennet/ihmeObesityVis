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
	
	
	var currentCountry = "Australia";
	var dataFilter = function(r) {
		if (r.age_group_id === "38" && r.metric === "obese" && r.sex_id === "3" && r.location_name === currentCountry) {
			return {
				location_name: r.location_name,
				year: +r.year,
				sex: r.sex,
				mean: +r.mean,
				lower: +r.lower,
				upper: +r.upper
			}
		}
	}
	
	var csvPath = "../data/IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV";
	d3.csv(csvPath, dataFilter, function(error, data) {
		d3.select("#loadingSpinner").attr("display", "none");
		
		g.append("g")
			.attr("class", "points")
			.selectAll("circle")
			.data(data)
			.enter().append("circle")
				.attr("class", "point both-point")
				.attr("r", "3px")
				.attr("cx", function(d) { return x(d.year); })
				.attr("cy", function(d) { return y(d.mean); });
	});
});