EzChartsConfig.aggregatedTitle = "Others";

EzChartsConfig.clickBarCb = function(elemClicked, chart){
	if(elemClicked.aggregated){
		var nbSelectedElem = d3.selectAll('rect')[0].length;
		chart.xLabelLayer.attr('opacity', 1);
		chart.TooltipVals.attr('opacity', 1);
		chart.xLabelLayer.transition().duration(1000).delay(1000).attr('opacity', 0);
		chart.TooltipVals.transition().duration(1000).attr('opacity', 0);

		d3.selectAll('rect').transition().each("start",function(elem,i){
			if(nbSelectedElem%2 != 0 && i == Math.round(nbSelectedElem/2) - 1){
				d3.select(this).transition().duration(1000).delay(nbSelectedElem*250)       
				.attr("y", -chart.height).style('fill', 'red').each("end", function(elem, i){				
					var donut = d3.select(chart.base.node())
						.chart('genericDonut');
    				donut.draw(chart.aggregatedData);
				});
			}
			else{
				if (i%2 == 0){
					d3.select(this)       
						.transition().duration(500).delay(i*250)         
						.attr("x", -chart.width);
					}								
				else{
					d3.select(this)       
						.transition().duration(500).delay(i*250)        
						.attr("x",chart.width);
					}	
				}
			});
	}
}

EzChartsConfig.transformCb = function(data, chart){
	return data;
}