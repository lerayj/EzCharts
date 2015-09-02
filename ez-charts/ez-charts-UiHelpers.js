// UI.registerHelper('EzChartBarHelper', function(width, height, data){
// 	console.log("w: ", width, " h: ", height);
// 	var test = d3.select('.chart');
// 	console.log("D3: ", test);
// 	var x = document.getElementsByClassName("chart");
// 	console.log("is chart? ", x);
//  	var chart = d3.select('.chart')
//         .append('svg')
//           .attr('width', width)
//           .attr('height', height)
//           .chart('verticalBar');
//     chart.draw(data);
// 	return ("data");
// });

UI.registerHelper('EzChartLine', function(data){
	console.log("I'm here: ", data);
	return ("data");
});

UI.registerHelper('EzChartPie', function(data){
	console.log("I'm here: ", data);
	return ("data");
});

Template.EzChartBar.rendered = function() {
	console.log("w: ", this.data.width, " h: ", this.data.height);
	var test = d3.select('.chart');
	console.log("D3: ", test);
	var x = document.getElementsByClassName("chart");
	console.log("is chart? ", x);
 	var chart = d3.select('.chart')
        .append('svg')
          .attr('width', this.data.width)
          .attr('height', this.data.height)
          .chart('verticalBar');
    chart.draw(this.data.data);
	return ("data");
}