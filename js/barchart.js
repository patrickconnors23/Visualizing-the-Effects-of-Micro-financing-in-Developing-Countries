

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BarChart = function(_parentElement, _data, _config){
	this.parentElement = _parentElement;
	this.data = _data;
	this.config = _config;
	this.displayData = _data;
	this.counter = 0;
	this.initVis();
}



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 10, right: 0, bottom: 10, left: 30 };

		vis.width = 600 - vis.margin.left - vis.margin.right,
	  vis.height = 150 - vis.margin.top - vis.margin.bottom;

		vis.svg = d3.select("#" + vis.parentElement).append("svg")
		    .attr("width", vis.width + vis.margin.left + vis.margin.right)
		    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	vis.x = d3.scale.linear()
		.range([0,vis.width - 150]);


	vis.y = d3.scale.ordinal()
		.rangePoints([vis.height,0]);

	// (Filter, aggregate, modify data)
	vis.wrangleData();
}

function domainer(object) {
	var arr = [" "];
	object.forEach(function (d) {
		arr.push(d.key);
	})
	arr.push("");
	return arr.reverse();
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by key variable (e.g. 'electricity') and count leaves
	// (2) Sort columsn descending
	var key = this.config.key;
	vis.displayData = d3.nest()
    .key(function(d) { return d[key]; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(vis.displayData);

	vis.displayData.sort(function (a,b) {
		return b.values - a.values;
	});
	// * TO-DO * //
	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(){
	var vis = this;

	vis.y.domain(domainer(vis.displayData));

	vis.x.domain([0,d3.max(vis.displayData,function(d){return d.values;})]);

	var barChart = vis.svg.selectAll("rect")
    .data(vis.displayData)

	barChart.exit().remove();

  barChart.enter()
    .append("rect")
    .attr("class","rect-class")
    .attr("fill","#2b5695")
    .attr("height",20)
		.attr("x",70);


	barChart
		.transition()
		.duration(200)
		.attr("width",function(d){
			// console.log(vis.x(d.values));
			return vis.x(d.values);
		})
    .attr("y",function (d,i) {
			if(vis.displayData.length == 4) {
				return i * 26 + 18.5;
			} else {
					return i * 32.5 +23;
			}
    });

	var yAxis = d3.svg.axis()
    .scale(vis.y)
    .orient("left");

		var yAxisGroup = vis.svg.append("g")
			.attr("transform","translate(70,0)")
			.attr("class", "y-axis axis");

			vis.svg.select(".y-axis")
				.transition()
				.call(yAxis);

	var chartLabel = vis.svg.selectAll("text.chart-labels")
        .data(vis.displayData)

	chartLabel.exit().remove();

	chartLabel
				.enter()
        .append("text")
        .attr("class","chart-labels");

	chartLabel
				.transition()
				.duration(200)
				.attr("x",function(d) {
					return vis.x(d.values) + 75;
				})

        .text(function (d) {
            return d.values;
        })
				.attr("y", function(d,i) {
            if(vis.displayData.length == 4) {
							return i * 25.5 + 32;
						} else {
								return i * 32.5 +36;
						}
        });

	vis.svg.selectAll("text.chart-title").remove();

	vis.svg.selectAll("text.chart-title")
	      .data(vis.displayData)
	      .enter()
	      .append("text")
	      .attr("class","chart-title")
				.attr("text-anchor","middle")
	      .attr("x",225)
	      .attr("y", 1)
	      .text(vis.config.title);
}

/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion){
	var vis = this;

	brushRegion.forEach(function (d) {
		d = new Date(d);
	})

	vis.data.forEach(function(d){
		d = new Date(d);
	})

	if (brushRegion[0].getUTCDate() != brushRegion[1].getUTCDate()) {
		vis.displayData = vis.data.filter(function (d) {
			return (d.survey.getUTCDate() >= brushRegion[0].getUTCDate() && d.survey.getUTCDate() <= brushRegion[1].getUTCDate());
		});
	}
	vis.wrangleData();
}
// && vis.data[10].survey.getUTCDate() >= brushRegion[1].getUTCDate()
