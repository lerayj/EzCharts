var precedChart = null;
var transData = null;

EzChartsConfig.Bars.aggregatedTitle = "TOTO";

EzChartsConfig.Bars.clickBarCb = function(elemClicked, chart){
	if(elemClicked.aggregated) {
		var nbSelectedElem = d3.selectAll('rect')[0].length;
		chart.xLabelLayer.attr('opacity', 1);
		chart.TooltipVals.attr('opacity', 1);
		chart.xLabelLayer.transition().duration(250).delay(250).attr('opacity', 0);
		chart.TooltipVals.transition().duration(250).attr('opacity', 0);


		var rectTransitions = d3.selectAll('rect').transition(500).delay(function (d, i) {
			return 250*i;
		});

		rectTransitions.attr('x', function (d, i) {
			return i%2 == 0 ? -chart.width : chart.width;
		}).each('end', function (d, i) {
			if (i == nbSelectedElem-1) {
				
				$('.chart svg').empty();
				var donut = d3.select('.chart svg')
					.chart('genericDonut');

				console.log("Donut: ", chart.aggregatedData);
				precedChart = chart;
				transData = chart.beforeTransformData;

				donut.draw(chart.aggregatedData);
			}
		});
	}
}

EzChartsConfig.Donut.clickDonutCb = function(elemClicked, chart){
	$('.chart svg').empty();
	console.log(chart.base);
	console.log("data transf: ", transData);
	var barsBack = d3.select(precedChart.svg).chart('genericBars');
	barsBack.draw(transData);
}