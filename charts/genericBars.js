//default but could be overloaded
var EzChartsConfig = { // TODO: Cette variable est global. Mais il n'y a pas que le bar chart qui va l'utilisé si ?
	'clickBarCb': function(elemClicked, chart){
 		//overload this callbackto customize
	},
	'clickLabelCb': function(labelClicked, chart){
		//overload this callbackto customize
	},
	'transformCb': function(){ // TODO: set argument et return valeur par default
		//overload this callbackto customize
	},
	"maxBars" : 5, // TODO: Not used
	"aggregateUnder": 5,
	"aggregatedTitle": "Others"
};

d3.chart("genericBars", {
	initialize: function(){
		var chart = this;

	    this.svg = this.base.node();
	   	this.margin = {top: 10, right: 10, bottom: 50, left: 10};
	   	this.width = +this.svg.getAttribute('width');
	    this.height = +this.svg.getAttribute('height');
		this.heightChart = chart.height - this.margin.top - this.margin.bottom;
		this.widthChart = chart.width - this.margin.left - this.margin.right;

	    this.aggregatedData = [];
	    this.barPad = 0.33; // TODO: En théorie c'est du margin pas du padding. Mais c'est un detail.
	    this.margeLabels = 10;

	    this.scaleY = d3.scale.linear()
	      .range([chart.heightChart, 0]);

	    var vBarsLayer = this.base.append('g') // TODO: v ?
	    .attr('transform', 'translate(' + chart.margin.left + ',0)')
	    .classed('vBars', true);

	    chart.layer('vBars', vBarsLayer, { // TODO: wtf v ?
	    	dataBind: function(data){
	    		// TODO: Declare ça plus haut. Et change le domain et le range dans le transform
		    	chart.scaleX = d3.scale.ordinal().domain(data.map(function(d){
			    	return d.id;
		    	}))
		    	.rangeBands([0, chart.widthChart - chart.margin.left - chart.margin.right], chart.barPad, 0); // Ca fait que tu retire deux fois les margin ici non ?
	    		
	    		return this.selectAll('rect').data(data, function(elem){
	    			return elem.id;
		    	});
	    	},
	    	insert: function(){
	    		return this.append('rect')
	    		// TODO: Pourquoi pas de :hover dans le css ? Ca a fait ses preuve comme truc.
	    		.on('mouseover', function(elem){
	    				d3.select(this).classed("hovered", true);
	    			})
	    		.on('mouseout', function(elem){
	    				d3.select(this).classed("hovered", false);
	    			})	    		
	    		.on('click', function(elem){
	    				// TODO: Fat callback !
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
	    				return chart.heightChart - chart.scaleY(elem.val);
	    			})
	    			.attr('width', function(elem, idx){
	    				return chart.scaleX.rangeBand();
	    			});
	    		},
	    		"exit:transition": function(){
	    			this.remove();
	    		}
	    	}
	    });

	    this.base.append('line').attr('x1', 0 + chart.margin.left)
          .attr('x2', chart.widthChart - chart.margin.right) // TODO: je comprend pas ton widthChart en faite. Il a l'air de servir a rien tu l'utilise jamais solo
          .attr('y1', chart.heightChart)
          .attr('y2', chart.heightChart)
          .attr('class', 'barAxis')

	    this.xlabels = chart.base.append('g')
	      .classed('xlabels', true)
	      .attr("transform", "translate(" + chart.margin.left + "," + (chart.height - chart.margin.bottom + chart.margeLabels) + ')');

	    this.xLabelLayer = chart.layer('xlabels', this.xlabels, {
	    	dataBind: function(data){
		    	return this.selectAll('text')
          			.data(data, function(d) { return d.label; });
	    	},
	       	insert : function() {
		        return this.append('text').classed('label', true)
		        .on('click', function(elem){
		        	EzChartsConfig.clickBarCb(elem, chart);
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
		          	.attr('dy', "0") // TODO: pourquoi ici et pas dans le enter ?
		          	.attr('text-anchor', 'middle'); // TODO: Pareil

		      		this.call(wrap, chart.scaleX.rangeBand()); // Style le call ici
		      	},
		      	"exit:transition": function(){
		      		this.remove();
		      	}
		      }   	
	    });

	    this.tooltipVals = chart.base.append('g')
	      .classed('tooltipVals', true)
	      .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ')');

		this.TooltipVals = chart.layer('tooltipVals', this.tooltipVals, {
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
		      			/********* TODO: CA SENS LA BIDOUILLE *******/
		      			var heightBar = chart.heightChart - chart.scaleY(elem.val);
		      			var percentageBar = (heightBar*100)/chart.heightChart;
		      			if (percentageBar > 20){
		      				return chart.heightChart - (heightBar/2);
		      			}else{
		      				return chart.heightChart - (heightBar + chart.margin.top+5);
		      			}
		      			/********************************************/
		      		})
		      		.attr('text-anchor', 'middle'); // TODO: text-anchor dans une transition ?
				},
		      	"exit:transition": function(){
		      		console.log("exit");
		      		this.remove();
		      	}
			}
		});
	},
	transform: function(data){
		var chart = this;
		//this.aggregatedData = [];

		var aggregData = [];
		var totalAggreg = 0;

		// TODO: Use d3.sum
		var totalValue = _.reduce(data, function(memo, elem){
			return memo + elem.val;
		},0);

		var underPercentage = (EzChartsConfig.aggregateUnder/100)*totalValue;

		// TODO: Use d3.sum
		_.each(data, function(elem, i){
			if(elem.val < underPercentage){
				chart.aggregatedData.push(elem);
				totalAggreg += elem.val;
			}
			else
				aggregData.push(elem);
		},chart);

		if(chart.aggregatedData.length > 1){
			aggregData.push({id: data.length + 1, label: EzChartsConfig.aggregatedTitle, val: totalAggreg, aggregated: true});
		}

		data = EzChartsConfig.transformCb(aggregData, chart); // TODO: La fonction par default ne renvoit rien. Donc ta data sera undefined si la fonction n'est pas overload.
		console.log("transformedData: ", this.aggregatedData);

		_.each(data, function(elem, idx, arr){
			if(elem.aggregated && elem.val == 0)
				arr.splice(idx, 1);
		});

		console.log("transform");
		var maxVal = d3.max(data, function(elem){
			return elem.val;
		});
	    this.scaleY.domain([0, maxVal]);

	    return data; // TODO: Dans l'idee tu devrais renvoyer la data modifier autant que possible. Plutot que de tout stock sur le chart.
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