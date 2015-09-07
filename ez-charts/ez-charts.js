var indexCore = 
{
  defaultBarIdx : 0,
  defaultLineIdx : 0,
  defaultDonutIdx : 0
}

Template.EzChartBar.helpers({
  "name": function(){
    return this.name;
  }
});

function drawerChoiceCore(classType, dataAttName, d3Type, Idx, data){
  var tpl = Template.instance();
  tpl.$(classType).attr(dataAttName, indexCore[Idx]);
  var chart = d3.select('[' + dataAttName + '="' + indexCore[Idx] + '"]')
        .append('svg')
          .attr('width', data.width)
          .attr('height', data.height)
          .chart(d3Type);
  chart.draw(data.data);
  indexCore[Idx]++;
  return true;
}


Template.EzChartBar.rendered = function() {
  drawerChoiceCore(".chartBar", "data-ezc-bar-id", 'verticalBar', "defaultBarIdx", this.data);
}

Template.EzChartLine.rendered = function() {
  drawerChoiceCore(".chartLine", "data-ezc-line-id", 'genericLines', "defaultLineIdx", this.data);
}

Template.EzChartDonut.rendered = function() {
  drawerChoiceCore(".chartDonut", "data-ezc-donut-id", 'genericDonut', "defaultDonutIdx", this.data);
}