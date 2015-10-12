d3.chart("genericWorldMap", {
	initialize: function(){
		var chart = this;
	    this.svg = this.base.node();
	   	this.width = +this.svg.getAttribute('width');
	    this.height = +this.svg.getAttribute('height');

		d3.json("./charts/fullMap.json", function(error, world) {
		if (error) return console.error(error);

		var allCountries = topojson.feature(world, world.objects.allCountries);

	    var projection = d3.geo.mercator()
		    .scale(chart.width / 2 / Math.PI)
		    .translate([chart.width / 2, chart.height / 2]);
		   
		var path = d3.geo.path()
    		.projection(projection);

    		chart.base.append("path")
			    .datum(allCountries)
			    .attr("d", path);

		chart.base.selectAll(".country")
	    .data(topojson.feature(world, world.objects.allCountries).features)
	  	.enter().append("path")
	    .attr("class", function(d) {
	    	return "country " + d.id; 
	 	})
	    .attr("d", path);
		});

		

		//extraire word du de l'async?
		// chart.layer("dots", chart.append('path'), {
		// 	dataBind: function(data){
		// 		this.selectAll(".country").data()
		// 	}

		// });
	}
});