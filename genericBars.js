
d3.chart("genericBars", {
	initialize: function(){


		var margin = {top: 10, right: 10, bottom: 50, left: 10},
		svg = this.base.node(),
	    width = +svg.getAttribute('width'),
	    height = +svg.getAttribute('height'),
	    heightChart = height - margin.top - margin.bottom,
	    widthChart = width - margin.left - margin.right,
	    chart = this,
	    barPad = 0.33,
	    margeLabels = 10;
	    
	    this.aggregatedData = new Array();

	    this.aggregLabel = "Others";
	    this.aggregLimit = 5;	      
	    this.scaleY = d3.scale.linear()
	      .range([heightChart, 0]);

	    var vBarsLayer = this.base.append('g').attr('transform', 'translate(' + margin.left + ',0)').classed('vBars', true);
	    chart.layer('vBars', vBarsLayer, {
	    	dataBind: function(data){
		    	chart.scaleX = d3.scale.ordinal().domain(data.map(function(d){
			    	return d.id;
		    	}))
		    	.rangeBands([0, widthChart - margin.left - margin.right], barPad, 0);
	    		
	    		return this.selectAll('rect').data(data, function(elem){
	    			return elem.id;
		    	});
	    	},
	    	insert: function(){
	    		return this.append('rect')
	    		.on('mouseover', function(elem){
	    				d3.select(this).classed("hovered", true);
	    			})
	    		.on('mouseout', function(elem){
	    				d3.select(this).classed("hovered", false);
	    			})	    		
	    		.on('click', function(elem){
	    				if(elem.aggregated){
	    					svg.transition();

	    				}
	    			});
	    	},
	    	events:{
	    		"merge:transition": function(){
	    			this.duration(1000)
	    			.attr('x', function(elem, idx){
	    				return chart.scaleX(elem.id);
	    			})
					.attr('y', function(elem, idx){
	    				return chart.scaleY(elem.val);
	    			})
	    			.attr('height', function(elem, idx){
	    				return heightChart - chart.scaleY(elem.val);
	    			})
	    			.attr('width', function(elem, idx){
	    				return chart.scaleX.rangeBand();
	    			});
	    		},
	    		exit: function(){
	    			this.remove();
	    		}
	    	}
	    });

	    this.base.append('line').attr('x1', 0 + margin.left)
          .attr('x2', widthChart - margin.right)
          .attr('y1', heightChart)
          .attr('y2', heightChart)
          .attr('class', 'barAxis')

	    this.xlabels = chart.base.append('g')
	      .classed('xlabels', true)
	      .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom + margeLabels) + ')');

	    
	    chart.layer('xlabels', this.xlabels, {
	    	dataBind: function(data){
		    return this.selectAll('text')
          		.data(data, function(d) { return d.label; });
	    	},
	       	insert : function() {
		        return this.append('text').classed('label', true)
		        .on('click', function(elem){
    				if(elem.aggregated){
    					console.log("node: ", chart.base.node().querySelectorAll(":scope *"));
    					d3.selectAll(chart.base.node().querySelectorAll(":scope *")).remove();
    					console.log("baseNode: ", chart.base.node());
						var donut = d3.select(chart.base.node())
						 .chart('genericDonut');
    					donut.draw(chart.aggregatedData);
    					console.log("aggreg data: ", chart.aggregatedData);

	    				}
    				
    			});
		      },
		      events: {
		      	merge: function(){

		      		this.text(function(elem){
		      			return elem.label;
		      		})
		      		.attr('x', function(elem, idx) {
		            	return chart.scaleX(elem.id) + chart.scaleX.rangeBand()/2;
		          	})
		          	.attr('dy', "0")
		          	.attr('text-anchor', 'middle');

		      		this.call(wrap, chart.scaleX.rangeBand());
		      	},
		      	exit: function(){
		      		this.remove();
		      	}
		      }   	
	    });

	    this.tooltipVals = chart.base.append('g')
	      .classed('tooltipVals', true)
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ')');

		chart.layer('tooltipVals', this.tooltipVals, {
			dataBind: function(data){
				return this.selectAll('.tooltipVal').data(data, function(d){
					return d.id;
				});
			},
			insert: function(){
				return this.append('text').classed('tooltipVal', true);
			},
			events: {
				"merge:transition": function(){
					this.text(function(elem){
		      			return elem.val;
		      		})
		      		.attr('x', function(elem){
		      			return chart.scaleX(elem.id) + chart.scaleX.rangeBand()/2;
		      		}).duration(1000)
		      		.attr('y', function(elem){
		      			var heightBar = heightChart - chart.scaleY(elem.val);
		      			var percentageBar = (heightBar*100)/heightChart;
		      			if (percentageBar > 20){
		      				return heightChart - (heightBar/2);
		      			}else{
		      				return heightChart - (heightBar + margin.top+5);
		      			}
		      		})
		      		.attr('text-anchor', 'middle');
				},
		      	exit: function(){
		      		this.remove();
		      	}
			}
		});
	},
	transform: function(data){

		var aggregData = new Array();
		var Alimit = this.aggregLimit;
		this.aggregatedData = new Array();
		_.each(data, function(elem, i){
			if(elem.val < Alimit){
				this.aggregatedData.push(elem);
			}
		},this);
		console.log("val: ", this.aggregatedData.length);
		if(this.aggregatedData.length > 1){
			var totalAggreg = 0;
			_.each(data, function(elem, i){
			if(elem.val < Alimit)
				totalAggreg += elem.val;
			else
				aggregData.push(elem);
			});
			aggregData.push({id: aggregData.length, label: this.aggregLabel, val: totalAggreg, aggregated: true});
			data = aggregData;
			console.log("data: ", data);
		}

		var maxVal = d3.max(data, function(elem){
			return elem.val;
		});
	    this.scaleY.domain([0, maxVal]);

	    return data;
	}
});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", text.attr('x')).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", text.attr('x')).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}