d3.chart('genericDonut', {
	initialize: function(){
		var svg = this.base.node(),
		width = +svg.getAttribute('width'),
		height = +svg.getAttribute('height'),
		
		
		chart = this;
		var margin = {bottom: 10, left: 10, top: 30, right: 10};
		var radius = Math.min(width - (margin.left + margin.right), height - (margin.bottom + margin.top)) / 2;
		var rLabel = radius + 20;
		var arc = d3.svg.arc()
		    .outerRadius(radius - 10)
		    .innerRadius(radius - 70);

		var pie = d3.layout.pie()
		  .value(function(d){ 
		  	return d.val; 
		  })
		  .sort(null);

		var donutBase = chart.base.append('g').attr('class', 'slices')
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
		chart.layer('donutSlices', donutBase, {
			dataBind: function(data){
				return this.selectAll('.slice').data(pie(data));
			},
			insert: function(){
				this.append('text').attr("transform", function(d) {
					var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					h = Math.sqrt(x*x + y*y);
					return "translate(" + (x/h * rLabel) +  ',' +
					(y/h * rLabel) +  ")"; 
				  })
			      .attr("dy", ".35em")
			      .style("text-anchor", "middle")
			      .text(function(d) { return d.data.label; });

				return this.append('path').attr('class', 'slice').attr('class', function(elem, idx){
					return 'slice-' + idx;
				}).attr('fill', 'black').attr('d', arc);
			},
			events: {
				merge: function(){

				}
			}
		});
	}
});