UI.registerHelper('EzChartLine', function(data){
	console.log("I'm here: ", data);
	return ("data");
});

UI.registerHelper('EzChartPie', function(data){
	console.log("I'm here: ", data);
	return ("data");
});

Template.EzChartBar.rendered = function() {
	var test = d3.select('.chartBar');
 	var chart = d3.select('.chartBar')
        .append('svg')
          .attr('width', this.data.width)
          .attr('height', this.data.height)
          .chart('verticalBar');
    chart.draw(this.data.data);
	return ("data");
}

Template.EzChartLine.rendered = function() {
	var test = d3.select('.chartLine');
 	var chart = d3.select('.chartLine')
        .append('svg')
          .attr('width', this.data.width)
          .attr('height', this.data.height)
          .chart('genericLines');
    chart.draw(this.data.data);
	return ("data");
}

Template.EzChartDonut.rendered = function() {
	var test = d3.select('.chartDonut');
 	var chart = d3.select('.chartDonut')
        .append('svg')
          .attr('width', this.data.width)
          .attr('height', this.data.height)
          .chart('genericDonut');
    chart.draw(this.data.data);
	return ("data");
}