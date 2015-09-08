var indexCore = 
{
  defaultBarIdx : 0,
  defaultLineIdx : 0,
  defaultDonutIdx : 0
}


EzCharts = {
  charts: [],

  drawerChoiceCore: function(classType, dataAttName, d3Type, Idx, data){
    var tpl = Template.instance();
    tpl.$(classType).attr(dataAttName, indexCore[Idx]);
    var chart = d3.select('[' + dataAttName + '="' + indexCore[Idx] + '"]')
          .append('svg')
            .attr('width', data.width)
            .attr('height', data.height)
            .chart(d3Type);
    chart.draw(data.data);
    
    //reference ajout charts
    var temp = {};
    temp["name"] = data.name;
    temp["ezId"] = indexCore[Idx];
    temp["refChart"] = chart;
    var typeChartsCollec = _.find(this.charts, function(elem){
      if(elem.type == dataAttName)
        return true;
    });
    if(typeChartsCollec == undefined)
      this.charts.push({"type": dataAttName, "charts": [temp] });
    else
      typeChartsCollec.charts.push(temp);
    indexCore[Idx]++;

    return chart;
  },
  reDraw: function(chartName, newData){
    var chartToDraw = null;
    _.each(this.charts, function(chartsTypeCollec){
      _.each(chartsTypeCollec.charts, function(chart){
        if(chart.name == chartName)
          chartToDraw = chart.refChart;
      });
    });
    if(chartToDraw != null)
      chartToDraw.draw(newData);
  }

}


Template.EzChartBar.rendered = function() {
  EzCharts.drawerChoiceCore(".chartBar", "data-ezc-bar-id", 'genericBars', "defaultBarIdx", this.data);
}

Template.EzChartLine.rendered = function() {
  EzCharts.drawerChoiceCore(".chartLine", "data-ezc-line-id", 'genericLines', "defaultLineIdx", this.data);
}

Template.EzChartDonut.rendered = function() {
  EzCharts.drawerChoiceCore(".chartDonut", "data-ezc-donut-id", 'genericDonut', "defaultDonutIdx", this.data);
}