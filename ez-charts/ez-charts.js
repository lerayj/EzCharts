var defaultBarIdx = 0;
var defaultLineIdx = 0;
var defaultDonutIdx = 0;
Template.EzChartBar.helpers({
  "name": function(){
    return this.name;
  }
});

function drawerChoiceCore(classType, dataAttName, d3Type, Idx, data){
  var tpl = Template.instance();
  tpl.$(classType).attr(dataAttName, Idx);
  var chart = d3.select('[' + dataAttName + '="' + Idx + '"]')
        .append('svg')
          .attr('width', data.width)
          .attr('height', data.height)
          .chart(d3Type);
  chart.draw(data.data);
  Idx++;
  return true;
}


Template.EzChartBar.rendered = function() {
  drawerChoiceCore(".chartBar", "data-ezc-bar-id", 'verticalBar', defaultBarIdx, this.data);
}

// Template.EzChartBar.rendered = function() {
//   var tpl = Template.instance();
//   tpl.$(".chartBar").attr("data-ezc-bar-id", defaultBarIdx);
//  	var chart = d3.select('[data-ezc-bar-id="' + defaultBarIdx + '"]')
//         .append('svg')
//           .attr('width', this.data.width)
//           .attr('height', this.data.height)
//           .chart('verticalBar');
//   chart.draw(this.data.data);
//   defaultBarIdx++;
// 	return ("data");
// }

Template.EzChartLine.rendered = function() {
  var tpl = Template.instance();
  tpl.$(".chartLine").attr("data-ezc-line-id", defaultLineIdx);
  var chart = d3.select('[data-ezc-line-id="' + defaultLineIdx + '"]')
        .append('svg')
          .attr('width', this.data.width)
          .attr('height', this.data.height)
          .chart('genericLines');
  chart.draw(this.data.data);
	defaultLineIdx++;
  return ("data");
}

Template.EzChartDonut.rendered = function() {
  var tpl = Template.instance();
  tpl.$(".chartDonut").attr("data-ezc-donut-id", defaultDonutIdx);
  var chart = d3.select('[data-ezc-donut-id="' + defaultDonutIdx + '"]')
        .append('svg')
          .attr('width', this.data.width)
          .attr('height', this.data.height)
          .chart('genericDonut');
  chart.draw(this.data.data);
  defaultDonutIdx++;
	return ("data");
}