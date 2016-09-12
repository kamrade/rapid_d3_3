var d3 = require("d3");
var classie = require("./classie");
// var topojson = require("topojson");
// var projection = require("d3-geo-projection");

var w = 1024;
var h = 768;

var projection = d3.geo.mercator()
						.center([0, 40])
						.translate([ w/2, h/2 ])
						.scale( [w/8] );


var path = d3.geo.path().projection(projection);


var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

d3.json("/data/geo02/ne_50m_admin_0_countries.json", function(json){
	var data = json.features;

	svg.selectAll("path")
				.data(data)
				.enter()
				.append("path")
				.classed("country", true)
				.attr("d", path);

});