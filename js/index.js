document.addEventListener("DOMContentLoaded", function(event) {		
	var margin = {top: 20, left: 40, right: 20, bottom: 20},
		width = 860 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		graph = d3.select("#graph"),
		g = graph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	graph.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
	
	//axes setup
	var x = d3.scaleLinear().rangeRound([0, width]),
		y = d3.scaleLinear().rangeRound([height, 0]);
	x.domain([1990, 2013]);
	y.domain([0, 1]);
	
	g.append("g")
		.attr("class", "axis xaxis")
    .attr("transform", "translate(0, " + height + ")")
		.call(d3.axisBottom(x));
		
	g.append("g")
		.attr("class", "axis yaxis")
    .attr("transform", "translate(0, 0)")
		.call(d3.axisLeft(y));
	
	
	var currentCountry = "United States";
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
	
	d3.csv("../data/IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV", dataFilter, function(error, data) {
		d3.select("#loadingSpinner").attr("display", "none");
		
		g.selectAll("dot")
			.data(data)
			.enter().append("circle")
				.attr("class", "point both-point")
				.attr("r", function(d) { return (d.upper - d.lower / 2) * 15; })
				.attr("cx", function(d) { return x(d.year); })
				.attr("cy", function(d) { return y(d.mean); });
	});
	
});