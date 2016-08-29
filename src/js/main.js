var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

console.log( "d3 version is " + d3.version );
window.d3 = d3;

var content = d3.select(".content");
var ul = content.append("ul");
var li;

var data1 = ["Item 1", "Item 2", "Item 3"];
var data2 = ["Item A", "Item B", "Item C", "Item D"];
var data3 = ["Item 100", "Item 101", "Item 102", "Item 103", "Item 104"];

li = ul.selectAll("li").data(data1).enter().append("li")
    .text(function(d){
        return d;
    });

li = ul.selectAll("li").data(data2).enter().append("li")
    .text(function(d, i){
        return d + " | " + i;
    });

li = ul.selectAll("li").data(data3).enter().append("li")
    .text(function(d){
        return d;
    });

li = ul.selectAll("li").data(data1).exit().remove();
