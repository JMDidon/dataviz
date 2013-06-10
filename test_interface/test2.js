$(document).ready(function(){

$.ajax(
      {
        type: 'POST',
        url:  'api.php',
        data: 'variable=valeur&variable2=valeur2',
        success: function(data)
        {
          var content = data;
          var objet = eval('(' + content + ')');
          console.log(objet);
          var retrieved_data = {};
          retrieved_data.moves = {};
retrieved_data.houses = {};
retrieved_data.places = {};
retrieved_data.episodes = {};
retrieved_data.characters = {};


/* Chargement des infos des épisodes */
$.get('api/get/moves', function(data)
{
retrieved_data.moves = JSON.parse(data);
//console.log(retrieved_data.moves);
});

$.get('api/get/houses', function(data)
{
retrieved_data.houses = JSON.parse(data);
//console.log(retrieved_data.houses);
});

$.get('api/get/places', function(data)
{
retrieved_data.places = JSON.parse(data);
//console.log(retrieved_data.places);
});

$.get('api/get/episodes', function(data)
{
retrieved_data.episodes = JSON.parse(data);
//console.log(retrieved_data.episodes);
});

$.get('api/get/characters', function(data)
{
retrieved_data.characters = JSON.parse(data);
console.log(retrieved_data.characters);
});

        }
      });


var w = 250,
    h = 300,
    t = .5,
    delta = .01,
    padding = 10,
    points = [{x: 10, y: 250}, {x: 0, y: 0}, {x: 100, y: 0}, {x: 200, y: 250}, {x: 225, y: 125}],
    bezier = {},
    line = d3.svg.line().x(x).y(y),
    n = 4,
    stroke = d3.scale.category20b(),
    orders = d3.range(2, n + 2);

var vis = d3.select("#vis").selectAll("svg")
    .data(orders)
  .enter().append("svg")
    .attr("width", w + 2 * padding)
    .attr("height", h + 2 * padding)
  .append("g")
    .attr("transform", "translate(" + padding + "," + padding + ")");

update();
*/
vis.selectAll("circle.control")
    .data(function(d) { return points.slice(0, d) })
  .enter().append("circle")
    .attr("class", "control")
    .attr("r", 7)
    .attr("cx", x)
    .attr("cy", y)
    .call(d3.behavior.drag()
      .on("dragstart", function(d) {
        this.__origin__ = [d.x, d.y];
      })
      .on("drag", function(d) {
        d.x = Math.min(w, Math.max(0, this.__origin__[0] += d3.event.dx));
        d.y = Math.min(h, Math.max(0, this.__origin__[1] += d3.event.dy));
        bezier = {};
        update();
        vis.selectAll("circle.control")
          .attr("cx", x)
          .attr("cy", y);
      })
      .on("dragend", function() {
        delete this.__origin__;
      }));

vis.append("text")
  .attr("class", "t")
  .attr("x", w / 2)
  .attr("y", h)
  .attr("text-anchor", "middle");

vis.selectAll("text.controltext")
    .data(function(d) { return points.slice(0, d); })
  .enter().append("text")
    .attr("class", "controltext")
    .attr("dx", "10px")
    .attr("dy", ".4em")
    .text(function(d, i) { return "P" + i });

var last = 0;
d3.timer(function(elapsed) {
  t = (t + (elapsed - last) / 5000) % 1;
  last = elapsed;
  update();
});

function update() {
  var interpolation = vis.selectAll("g")
      .data(function(d) { return getLevels(d, t); });
  interpolation.enter().append("g")
      .style("fill", colour)
      .style("stroke", colour);

  var circle = interpolation.selectAll("circle")
      .data(Object);
  circle.enter().append("circle")
      .attr("r", 4);
  circle
      .attr("cx", x)
      .attr("cy", y);

  var path = interpolation.selectAll("path")
      .data(function(d) { return [d]; });
  path.enter().append("path")
      .attr("class", "line")
      .attr("d", line);
  path.attr("d", line);

  var curve = vis.selectAll("path.curve")
      .data(getCurve);
  curve.enter().append("path")
      .attr("class", "curve");
  curve.attr("d", line);

  vis.selectAll("text.controltext")
      .attr("x", x)
      .attr("y", y);
  vis.selectAll("text.t")
      .text("t=" + t.toFixed(2));
}

function interpolate(d, p) {
  if (arguments.length < 2) p = t;
  var r = [];
  for (var i=1; i<d.length; i++) {
    var d0 = d[i-1], d1 = d[i];
    r.push({x: d0.x + (d1.x - d0.x) * p, y: d0.y + (d1.y - d0.y) * p});
  }
  return r;
}

function getLevels(d, t_) {
  if (arguments.length < 2) t_ = t;
  var x = [points.slice(0, d)];
  for (var i=1; i<d; i++) {
    x.push(interpolate(x[x.length-1], t_));
  }
  return x;
}

function getCurve(d) {
  var curve = bezier[d];
  if (!curve) {
    curve = bezier[d] = [];
    for (var t_=0; t_<=1; t_+=delta) {
      var x = getLevels(d, t_);
      curve.push(x[x.length-1][0]);
    }
  }
  return [curve.slice(0, t / delta + 1)];
}

function x(d) { return d.x; }
function y(d) { return d.y; }
function colour(d, i) {
  stroke(-i);
  return d.length > 1 ? stroke(i) : "red";
}

});

