//default but could be overloaded
var EzChartsConfig = {
	"Bars":{
		'clickBarCb': function(elemClicked, chart){
	 		//overload this callbackto customize
		},
		'clickLabelCb': function(labelClicked, chart){
			//overload this callbackto customize
		},
		'transformCb': function(data, chart){
			//overload this callbackto customize
			return data;
		},
		"maxBars" : 5,
		"aggregateUnder": 100,
		"aggregatedTitle": "Others"
	},
	"Donut": {
		'donutSize': 0,
		'holeSize': 40,
		'clickDonutCb': function(elemClicked, chart){
	 		//overload this callbackto customize
		}
	},
	"Map": {
		"TopoFile" : "dataMap.json"
	},
	"Lines": {
		
	}
};
