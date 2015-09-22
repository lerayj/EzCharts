d3.chart('genericDonut', {
	initialize: function(){

		var chart = this;
	    this.svg = chart.base.node();
	   	this.margin = {top: 10, right: 10, bottom: 30, left: 10};
	   	this.width = +chart.svg.getAttribute('width');
	    this.height = +chart.svg.getAttribute('height');
		this.heightChart = chart.height - chart.margin.top - chart.margin.bottom;
		this.widthChart = chart.width - chart.margin.left - chart.margin.right;

		this.radius = Math.min(chart.width - (chart.margin.left + chart.margin.right), chart.height - (chart.margin.bottom + chart.margin.top)) / 2;
		
		var rLabel = chart.radius + 10;
		
		this.arc = d3.svg.arc()
		    .outerRadius(chart.radius - EzChartsConfig.Donut.donutSize)
		    .innerRadius(chart.radius - EzChartsConfig.Donut.holeSize);

		var pie = d3.layout.pie()
		  .value(function(d){ 
		  	return d.val; 
		  });

		var donutBase = chart.base.append('g').attr('class', 'slices')
			.attr("transform", "translate(" + chart.width / 2 + "," + chart.height / 2 + ")")
			.on('click', function(elem){
		        	EzChartsConfig.Donut.clickDonutCb(elem, chart);
    			});
		this.pieLayer = chart.layer('donutSlices', donutBase, {
			dataBind: function(data){

				return this.selectAll('.slice').data(pie(data), function(elem){
					return elem.data.id;
				});
			},
			insert: function(){

				this.append('text').attr("transform", function(d) {
					var c = chart.arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y);
					return "translate(" + (x/h * rLabel) +  ',' +
					(y/h * rLabel) +  ")"; 
				  })
			      .attr("dy", ".35em")
			      .style("text-anchor", function(d) {
			        console.log("d: ", d);
			        return (d.endAngle + d.startAngle)/2 > Math.PI ?
			            "end" : "start";
			    })
			      .text(function(d) { return d.data.label; });

				return this.append('path').attr('class', 'slice');
			},
			events: {
				 merge: function(){
				 	this.attr('class', function(elem, idx){
						return 'slice slice-' + idx;
					}).attr('fill', 'black').attr('d', chart.arc);
				}
			}
		});
	}
});