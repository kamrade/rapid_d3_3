var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

// window.d3 = d3;

// VARS ********************************
var positions = {G:"Goalkeeper", D:"Defender", M:"Midfielder", F:"Forward"};
var columns = ["No", "Name",  "Pos"];
var columnsNormal = ["No", "Name", "Pos"];
var columnsAll = ["No", "Name", "Team", "Pos"];

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

			// наполнение массива teams
			if(teams.indexOf(d.TeamID) < 0) {
				teams.push(d.TeamID);
				teams[d.TeamID] = d.Team;
			}
		});

		// забиваем options названиями команд
		var options = teamSelector.selectAll("option")
			.data(teams)
			.enter()
				.append("option")
				.attr("value", function(d){ return d; } )
				.text(function(d) { return teams[d]; })
				.sort(function(a,b) { return d3.ascending(a, b); });

		// и вручную добавляем еще один элемент в начало
		var teamSelect = document.querySelector("#team-selector");
		var optAll = document.createElement("option");
		optAll.setAttribute("value", "all");
		optAll.innerText = "All";
		teamSelect.insertBefore(optAll, teamSelect.children[0]);

		selectTeam("afc-wimbledon");
	})
};

// TEAM-SELECTOR ********************************
var teamSelector = d3.select(".page-title")
	.append("select")
	.on("change", function(){ selectTeam(this.value); })
	.attr("id", "team-selector");


// REDRAW ********************************
var redraw = function(roster){

	// добавляем колонки
	var thh = thead.selectAll("th").data(columns);
	thh.enter().append("th").text(function(d){ return d; });
	thh.exit().remove();
	thh.on("click", function(d){ // d - это название колонки (клик по названию колонки)
		tbody.selectAll("tr")
			.sort(function(a,b){
				return (d === "No")
					? d3.ascending(+a[d], +b[d])
					: d3.ascending(a[d], b[d]);
			})
		.style("background-color", function(d, i){
			return (i%2) ? "#efefef" : "#fff";
		});
	});
	
	// добавляем строки
	var rows = tbody.selectAll("tr")
		.data(roster);
	rows.enter().append("tr")
		.style("background-color", function(d, i){
			return (i%2) ? "#efefef" : "#fff";
		});
	rows.exit().remove();

	// добавляем ячейки
	var cells = rows.selectAll("td")
		.data(function(row){
			var values = [];
			columns.forEach(function(d){ values.push(row[d]); })
			return values;
		});

	cells.enter().append("td");
	cells.exit().remove();
	cells.text(function(d){ return d; });

};

var selectTeam = function(teamId){
	// фильтруем data так, чтобы в выборке были только те элементы
	// для которых TeamID совпадает с запрашиваемым teamId
	if(teamId == "all"){
		var roster = data;
		columns = columnsAll;
	} else {
		columns = columnsNormal;
		var roster = data.filter(function(d){
			return d['TeamID'] == teamId;
		});		
	}

	d3.select("#team-name").text((teams[teamId] || "All") + " Roster");
	document.getElementById('team-selector').value = teamId;

	// console.log(teamSelector[0][0]);
	// teamSelector[0][0].value = teamId;
	redraw(roster);
};

reload();
