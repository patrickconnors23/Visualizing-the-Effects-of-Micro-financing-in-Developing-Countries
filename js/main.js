var ch = 0;
// Bar chart configurations: data keys and chart titles
var configs = [
	{ key: "ownrent", title: "Own or Rent" },
	{ key: "electricity", title: "Electricity" },
	{ key: "latrine", title: "Latrine" },
	{ key: "hohreligion", title: "Religion" }
];


// Initialize variables to save the charts later
var barcharts = [];
var areachart;


// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y-%m-%d").parse;


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new area chart object

d3.csv("data/household_characteristics.csv", function(data){
	data.forEach(function (d) {
		d.survey = parseDate(d.survey);
	})

	// * TO-DO *
	createVis(data);
});

var rentChart;
var electricityChart;
var latrineChart;
var religionChart;
var areachart;

function createVis (data) {
	rentChart = new BarChart("rent-container",data,configs[0]);
	electricityChart = new BarChart("electricity-container",data,configs[1]);
	latrineChart = new BarChart("latrine-container",data,configs[2]);
	religionChart = new BarChart("religion-container",data,configs[3]);
	areachart = new AreaChart("areachart-container",data);
}

// React to 'brushed' event and update all bar charts
function brushed(interval) {

	// * TO-DO *
	rentChart.selectionChanged(interval);
	electricityChart.selectionChanged(interval);
	latrineChart.selectionChanged(interval);
	religionChart.selectionChanged(interval);
}
