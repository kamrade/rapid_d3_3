var d3 = require("d3");
var classie = require("./classie");
// var topojson = require("topojson");
// var projection = require("d3-geo-projection");

var w = 1024;
var h = 768;

var year = 1999;

var container = document.querySelector(".content");
console.dir(container);
console.log(container.clientWidth);
console.log(container.clientHeight);

// w = container.clientWidth;
// h = container.clientHeight;

window.addEventListener("resize", function(){
	console.log("resize");
});

// https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md
// http://bl.ocks.org/mbostock/3757132
var projection = d3.geo.mercator()
						.center([0, 40])
						.translate([ w/2, h/2 ])
						.scale( [w/8] );

// В projection мы кладем [Longitude, Latitude]
//  для работы с консолью делаем его глобальным
window.projection = projection;
window.d3 = d3;

// определяем path-generator
var path = d3.geo.path().projection(projection);

var color = d3.scale.quantize()
					.range([ "#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0025" ]);

// создаем svg
var svg = d3.select(".content")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

d3.csv("/data/co2_emissions.csv", function(data){
	color.domain([
		d3.min(data, function(d){ return +d[year]; }),
		d3.max(data, function(d){ return +d[year]; })
	]);

	console.log(data);


	d3.json("/data/geo02/ne_50m_admin_0_countries.json", function(json){
		
		for(var i = 0; i < data.length; i++) {
			// grab country name
			var dataCountryCode = data[i].countryCode

			var dataValue = +data[i][year];

			for(var j = 0; j < json.features.length; j++) {
				var jsonCountryCode = json.features[j].properties.iso_a3;
				
				if(dataCountryCode == jsonCountryCode) {
					json.features[j].properties.co2 = dataValue;
					break;
				}

			}
		}

		svg.selectAll("path")
					.data(json.features)
					.enter()
					.append("path")
					.classed("country", true)
					.attr("d", path)
					.style("fill", function(d){
						var value = d.properties.co2;
						if(value) {
							return color(value);
						} else {
							return "#333";
						}
					})

	});


})


