d3.chart('genericTimeLines', {
	initialize: function(){
		var chart = this;
	    this.svg = this.base.node();
	   	this.margin = {top: 10, right: 10, bottom: 10, left: 10};
	   	this.width = +this.svg.getAttribute('width');
	    this.height = +this.svg.getAttribute('height');
		this.heightChart = chart.height - this.margin.top - this.margin.bottom;
		this.widthChart = chart.width - this.margin.left - this.margin.right;

		chart.layer("timeLines", this.base.append('g'), {
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
		          this.duration(1000).attr('d', function (line) {
		            return svgLine(line.points);
		          });
				},
				exit: function(){
	    			this.remove();
	    		}
			}
		});
	},
	transform: function(data){
		return data;
	}
});