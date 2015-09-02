d3.chart('genericLines', {
	initialize: function(){
		var svg = this.base.node(),
		width = +svg.getAttribute('width'),
		height = +svg.getAttribute('height'),
		chart = this;

		var margin = {bottom: 50, left: 30, top: 5, right: 10};

	    chart.x = d3.scale.linear()
	      .range([0, width-margin.left-margin.right]);

	    chart.y = d3.scale.linear()
	      .range([height-margin.bottom-margin.top-1, 0]);

	    chart.xAxis = d3.svg.axis()
	      .scale(this.x)
	      .orient('bottom');

	    chart.yAxis = d3.svg.axis()
	      .scale(this.y)
	      .orient('left');

    	var svgLine = d3.svg.line()
	        .x(function (d) {
	        	return chart.x(d.coord[0]);
	        })
	        .y(function (d) {
	        	return chart.y(d.coord[1]);
	        })
	        .interpolate('basis');

		chart.layer("lines", this.base.append('g'), {
			dataBind: function(data){
				return this.selectAll(".line").data(data, function(elem){
					return elem.id;
				});
			},
			insert: function(data){
				return this.append('path').attr('class', 'line');
			},
			events: {
				enter: function(){
		          this.attr('d', function (line) {
		            //console.log(line);
		            return svgLine(line.points);
		          });
				}
			},
		});
		this.svgXAxis = this.base.append('g')
	      .attr('class', 'axis')
	      .attr('transform', 'translate(' + (margin.left || 0) + ',' + (height-margin.bottom-1) + ')')

	    this.svgYAxis = this.base.append('g')
	      .attr('class', 'axis')
	      .attr('transform', 'translate(' + (margin.left || 0) + ',' + (margin.top || 0) + ' )')
	
	},
	transform: function(data){
		var maxY = d3.max(data, function(line){
			var res = _.max(line.points, function(pts){
				return pts.coord[1];
			});
			return res.coord[1];
		});
		var maxX = d3.max(data, function(line){
			var res = _.max(line.points, function(pts){
				return pts.coord[0];
			});
			return res.coord[0];
		});
		console.log("maxX: ", maxX, " maxY: ", maxY);
		chart.x.domain([0, maxX]);
		chart.y.domain([0, maxY]);

		this.svgXAxis.call(this.xAxis);
		this.svgYAxis.call(this.yAxis);

		return data;

	}


});









