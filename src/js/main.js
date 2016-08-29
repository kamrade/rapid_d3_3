var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

console.log( "d3 version is " + d3.version );

// VARS ********************************
var positions = {G:"Goalkeeper", D:"Defender", M:"Midfielder", F:"Forward"};

var columns = ["No", "Name", "Team", "Pos"];

var data = [];
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
            if(teams.indexOf(d.TeamID) < 0) {
                teams.push(d.TeamID);
                teams[d.TeamID] = d.Team;
            }
        });

    console.log(teams);
    var options = teamSelector.selectAll("option")
        .data(teams)
        .enter()
            .append("option")
            .attr("value", function(d){ return d; } )
            .text(function(d) { return teams[d]; })
            .sort(function(a,b) { return d3.ascending(a, b); });

        selectTeam("afc-wimbledon");
    })
};

var teamSelector = d3.select(".page-title")
    .append("select")
    .on("change", function(){ selectTeam(this.value); })
    .attr("id", "team-selector");

// REDRAW ********************************
var redraw = function(roster){

    thead.selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(d){ return d; })
    ;

    var rows = tbody.selectAll("tr")
        .data(roster);
    
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

var selectTeam = function(teamId){
    var roster = data.filter(function(d){
        return d['teamID'] == teamId;
    });
    d3.select("#team-name").text(teams[teamId] + " Roster");
    document.getElementById('team-selector').value = teamId;
    redraw(roster);
};

reload();