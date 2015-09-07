d3.chart("verticalBar", {
	initialize: function(){

		var margin = {top: 10, right: 10, bottom: 100, left: 10}
		var svg = this.base.node(),
	    width = +svg.getAttribute('width') - margin.left - margin.right,
	    height = +svg.getAttribute('height') - margin.top - margin.bottom,
	    chart = this,
	    marginBar = 10;
	    
	    chart.data = null;

	    chart.layers = {};
	    	      
	    this.scaleY = d3.scale.linear()
	      .range([height, 0]);
	    var xAxis = d3.svg.axis().orient("bottom")

	    chart.layers.xlabels = chart.base.append('g')
	      .classed('xlabels', true)
	      .attr('height', 20)
	      .attr("transform", "translate(0, " + (height - 5) + ')');

	    chart.layer('vBars', this.base.append('g'), {
	    	dataBind: function(data){
	    		chart.data = data;
	    		var nbMargin = data.length - 1;
	    		barWidth = (width/data.length) - ((nbMargin/data.length)*marginBar);
	    		return this.selectAll('rect').data(data, function(elem){
	    			return elem.id;
	    		});
	    	},
	    	insert: function(){
	    		return this.append('rect');
	    	},
	    	events:{
	    		merge: function(){
	    			this.attr('x', function(elem, idx){
	    				return (idx*barWidth) + (marginBar*idx);
	    			}).attr('y', function(elem, idx){
	    				return chart.scaleY(elem.value) - 25;
	    			}).attr('height', function(elem, idx){
	    				return height - chart.scaleY(elem.value);
	    			}).attr('width', function(elem, idx){
	    				return barWidth;
	    			});
	    		},
	    		exit: function(){
	    			this.remove();
	    		}
	    	}
	    });

	    this.base.append('line').attr('x1', 0)
          .attr('x2', width)
          .attr('y1', height - 25)
          .attr('y2', height - 25)
          .attr('class', 'barAxis')


	    chart.layer('xlabels', chart.layers.xlabels, {
	    	dataBind: function(data){
	    	chart.data = data;
		    return this.selectAll('text')
          		.data(data, function(d) { return d.name; });
	    	},
	       	insert : function() {
	       		//TOTEST: problem update sur ajout d'un nouveau label barwidth n'est pas maj
		        return this.append('text')
		          .classed('label', true)
		          .attr('text-anchor', 'middle')
		          .attr('x', function(d, idx) {
		            return (idx*barWidth) + (marginBar*idx) + barWidth/2;
		          })

		          .text(function(d) {
		            return d.name;
		          });
		      },
		      events: {
		      	merge: function(){
		      		data = chart.data;
		      		nbMargin = data.length - 1;
	    			barWidth = (width/data.length) - ((nbMargin/data.length)*marginBar);
		      		this.text(function(elem){
		      			return elem.name;
		      		}).
		      		attr('transform', function(elem, idx){
		      			return "translate(" + ((idx*barWidth) + (marginBar*idx) + barWidth/2) + ")";
		      		}).attr('dy', "0");
		      		this.call(wrap, barWidth);
		      	},
		      	exit: function(){
		      		this.remove();
		      	}
		      }   	
	    });
	},
	transform: function(data){
		var maxVal = d3.max(data, function(elem){
			return elem.value;
		});
	    this.scaleY.domain([0, maxVal]);
	    return data;
	}
});


//TODO: calculate margin by text height
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
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}