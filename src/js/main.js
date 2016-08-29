var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

console.log( "d3 version is " + d3.version );

// VARS ********************************
var positions = {G:"Goalkeeper", D:"Defender", M:"Midfielder", F:"Forward"};
var columns = ["No", "Name", "Pos"];

window.data = [];
var table = d3.select(".content")
    .append("table")
    .classed("table", true);
var thead = table.append("thead");
var tbody = table.append("tbody");



// RELOAD ********************************
var reload = function(){
    d3.tsv('/data/afcw-roster.tsv', function(rows){
        data = rows;
        data.forEach(function(d){
            d.Pos = positions[d.Pos];
        });
        redraw();
    })
};


// REDRAW ********************************
var redraw = function(){

    thead.selectAll("tr")
        .data([columns])
        .enter()
        .append("tr")
            .selectAll("th")
            .data(function(d) { return d; })
            .enter()
            .append("th")
            .text(function(d) { return d; })
    ;

    var rows = tbody.selectAll("tr")
        .data(data);
    rows.enter().append("tr");
    // если мы уже загрузили объект
    // и хотим загрузить другой, то если он короче, удаляет оставшиеся <tr>
    rows.exit().remove();

    var cells = rows.selectAll("td")
        .data(function(row){
            return columns.map(function(col){
                return row[col];
            });
        });

    cells.enter().append("td");
    cells.text(function(d){ return d; });
};

reload();
