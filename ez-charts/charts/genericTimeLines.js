d3.chart('genericTimeLines', {
	initialize: function(){
		var chart = this;
	    this.svg = this.base.node();
	   	this.margin = {top: 10, right: 70, bottom: 50, left: 70};
	   	this.width = +this.svg.getAttribute('width');
	    this.height = +this.svg.getAttribute('height');
		this.heightChart = chart.height - this.margin.top - this.margin.bottom;
		this.widthChart = chart.width - this.margin.left - this.margin.right;

		this.currentDate = new Date();
		this.daysInMonth = daysInMonth(this.currentDate.getMonth(),this.currentDate.getYear());

	    chart.x = d3.scale.linear()
	      .range([this.margin.left, this.width-this.margin.right]);

		this.x.domain([1, this.daysInMonth]);

	    chart.y = d3.scale.linear()
	      .range([this.height-this.margin.bottom-this.margin.top-1, 0]);

		this.xAxis = d3.svg.axis()
		    .scale(this.x)
		    .ticks(this.daysInMonth)
		    .orient("bottom")
		    .innerTickSize(-this.height)
    		.outerTickSize(0).tickPadding(10);

		this.yAxis = d3.svg.axis()
		    .scale(this.y)
		    .orient("left")
		    .innerTickSize(-this.width + this.margin.right + this.margin.left)
    		.outerTickSize(0).tickPadding(10);

		// Define 'div' for tooltips
		this.divTip = d3.select("body")
			.append("div")  // declare the tooltip div 
			.attr("class", "tooltipChartLine")              // apply the 'tooltip' class
			.style("opacity", 0); 

		var svgLine = d3.svg.line()
	        .x(function (d) {
	        	return chart.x(d.id);
	        })
	        .y(function (d) {
	        	return chart.y(d.valueY);
	        })
	       ;

		this.svgXAxis = this.base.append('g')
	      .attr('class', 'axis')
	      .attr('transform', 'translate(0,' + (this.height-this.margin.bottom-1) + ')');

	    this.svgYAxis = this.base.append('g')
	      .attr('class', 'axis')
	      .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top) + ')');
	


		chart.layer("timeLines", this.base.append('g').attr('transform', 'translate(' + 28 + ',' + (this.margin.top) + ')'), {
			dataBind: function(data){
				return this.selectAll(".line").data(data, function(elem){
					return elem.id;
				});
			},
			insert: function(data){
				return this.append('path').attr('class', 'line');

			},
			events: {
				"merge:transition": function(){

			
		          this.duration(250).attr('d', function(line){
		            return svgLine(line.points);
		          });

				},
				exit: function(){
	    			this.remove();
	    		}
			}
		});

		chart.layer("bulletValue", this.base.append('g').attr('transform', 'translate(' + 28 + ',' + (this.margin.top) + ')'), {
		dataBind: function(data){
			return this.selectAll(".bulletLine").data(data[0].points, function(elem){
				return elem.id;
			});
		},
		insert: function(){

			return this.append('circle').classed('bulletLine', true)				
					.on("mouseover", function(d) {		
		            chart.divTip.transition()
						.duration(500)	
						.style("opacity", 0);
					chart.divTip.transition()
						.duration(200)	
						.style("opacity", .9);	

					chart.divTip.html('<span>'+ d.valueY + '</span>')	 
					.style("left", (d3.event.pageX) + "px")			 
					.style("top", (d3.event.pageY - 28) + "px");
					})
					.on("mouseout", function(d){
					chart.divTip.transition()
						.duration(500)	
						.style("opacity", .9);
					chart.divTip.transition()
						.duration(200)	
						.style("opacity", 0);	
					});


		},
		events:{
    		"merge:transition": function(){





    			this.duration(250)
    			.attr('cx', function(d){
				return chart.x(d.id);
				})
				.attr('cy', function(d){
					return chart.y(d.valueY);
				})
				.attr('r', 5);
				
    		}
	    }
	});
	},

	transform: function(data){
		var chart = this;


		this.y.domain(linesExtent(data));

	    this.svgXAxis.call(this.xAxis);
	    this.svgYAxis.call(this.yAxis);
		return data;
	}
});

	function daysInMonth(month,year) {
	    return new Date(year, month, 0).getDate();
	}

    function linesExtent (lines) {
      var max = d3.max(lines, function (line) {
        return d3.max(line.points, function (point) {
          return point.valueY;
        });
      });

      var min = d3.min(lines, function (line) {
        return d3.min(line.points, function (point) {
          return point.valueY;
        });
      });

      return [min, max + 10];
    }