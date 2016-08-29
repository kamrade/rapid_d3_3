var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

console.log( "d3 version is " + d3.version );

// VARS ********************************
var positions = {G:"Goalkeeper", D:"Defender", M:"Midfielder", F:"Forward"};

var columns = ["No", "Name", "Team", "Pos"];

window.data = [];
var teams = [];
var table = d3.select(".content")
    .append("table")
    .classed("table", true);
var thead = table.append("thead").append("tr");
var tbody = table.append("tbody");


// RELOAD ********************************
var reload = function(){
    d3.tsv('/data/eng2-rosters.tsv', function(rows){
        data = rows;
        data.forEach(function(d){
            d.Pos = positions[d.Pos];
        });
        redraw();
    })
};


// REDRAW ********************************
var redraw = function(){
    thead.selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(d){ return d; })
    ;

    var rows = tbody.selectAll("tr")
        .data(data);
    
    rows.enter().append("tr");
    rows.exit().remove();

    var cells = rows.selectAll("td")
        .data(function(row){
            var values = [];
            columns.forEach(function(d){ values.push(row[d]); })
            return values;
        });

    cells.enter().append("td");
    cells.text(function(d){ return d; });

};

reload();
