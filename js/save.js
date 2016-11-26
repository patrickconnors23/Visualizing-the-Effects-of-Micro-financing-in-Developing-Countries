
/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */

AreaChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = [];

	this.initVis();
}


/*
 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
 */

AreaChart.prototype.initVis = function(){
	var vis = this;

	// * TO-DO *
	vis.margin = { top: 10, right: 0, bottom: 20, left: 35 };

		vis.width = 550 - vis.margin.left - vis.margin.right,
	  vis.height = 500 - vis.margin.top - vis.margin.bottom;

		vis.svg = d3.select("#" + vis.parentElement).append("svg")
		    .attr("width", vis.width + vis.margin.left + vis.margin.right)
		    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.x = d3.time.scale()
			.range([0,vis.width])
			.domain(d3.extent(vis.data, function(d) { return d.survey; }));

	vis.y = d3.scale.linear()
		.range([vis.height,0]);

	// (Filter, aggregate, modify data)
	vis.wrangleData();
}


/*
 * Data wrangling
 */

AreaChart.prototype.wrangleData = function(){
		var vis = this;
		// (1) Group data by date and count survey results for each day
		// (2) Sort data by day
		vis.data.sort(function(a,b) {
			return a.survey - b.survey;
		});
		vis.data = d3.nest()
	    .key(function(d) { return d.survey; })
			.rollup(function(leaves) { return leaves.length; })
			.entries(vis.data);

		vis.data.forEach(function(d){
			d.key = new Date(d.key);
		});

		vis.updateVis();
}

/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function(){
		var vis = this;

		// vis.x = d3.time.scale()
		// 	.range([0,vis.width])
		// 	.domain(d3.extent(vis.data, function(d) { return d.survey; }));
			// .domain([vis.data[0].key,vis.data[25].key]);


		vis.y.domain([0, d3.max(vis.data,function (d) {return d.values;})]);

		console.log(vis.data[0].key,vis.data[25].key);
		console.log([0,vis.width]);
		var dat = (vis.data[4].key);
		console.log(dat);
		console.log(vis.x(dat));
		// console.log(vis.x);

		vis.xAxis = d3.svg.axis()
	    .scale(vis.x)
			.ticks(5)
	    .orient("bottom");

		// vis.yAxis.attr("class", "y-axis axis");
		vis.svg.append("g")
	    .attr("class", "x axis x-axis")
	    .attr("transform", "translate(20,"+vis.height+")")
	    .call(vis.xAxis);


		vis.yAxis = d3.svg.axis()
			.scale(vis.y)
			.ticks(10)
			.orient("left");

		// vis.yAxis.attr("class", "y-axis axis");
		vis.svg.append("g")
			.attr("class", "y axis y-axis")
			.call(vis.yAxis);

		var area = d3.svg.area()
      .x(function(d) {
				// console.log(vis.x(d.key));
				return vis.x(d.key); })
      .y0(vis.height)
      .y1(function(d) { return vis.y(d.values); });

		var context = vis.svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		var path = vis.svg.append("path")
        .datum(vis.data)
        .attr("class", "area brushable")
        .attr("d", area)

		//////////////
		/// BRUSH ///
		/////////////

		var xContext = d3.time.scale()
	    .range([0, vis.width])
	    .domain(d3.extent(vis.data, function(d) { return d.key; }));

		// Initialize brush component
		var brush = d3.svg.brush()
		    .x(xContext)
		    .on("brush", brushed);

		function brushed() {
		    // Set new domain if brush (user selection) is not empty
		    xFocus.domain(
		        brush.empty() ? xContext.domain() : brush.extent()
		    );
		vis.svg.append("g")
    		.attr("class", "x brush")
      	.call(brush)
    		.selectAll("rect")
      	.attr("y", -6)
      	.attr("height", vis.height + 7);

		


		    // Update focus chart (detailed information)
		}

	// * TO-DO *

}
