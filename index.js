// making the svg, adjusted the margin to make it fit better
var svg = d3.select("svg"),
    margin = {top: 30, right: 20, bottom: 30, left: 20},
// adding attribute "width" to the width variable. so it has a width of "width" minus margin left - margin right. In this chart it is 1100 - 20 - 20
    width = svg.attr("width") - margin.left - margin.right,
// same story for the height as for the width.
    height = svg.attr("height") - margin.top - margin.bottom,
// making the variable g by appending the "g" element to the svg. "g" is a SVG element and is a container to group svg elements. It is used as a refference point to get all the data in the right place
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// parse the date
var parseTime = d3.timeParse("%Y%m%d");

// making the variables for the scales of the y and x axis. It is a function that will get the minimum and the maximum scale of the data. x setting the date, y setting the temprature
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
// var z defines the chart itself. d3.schemeCategory10 contains ten colors used for the color of the graph
    z = d3.scaleOrdinal(d3.schemeCategory10);

// make a new line
var line = d3.line()
// smootihing the line
    .curve(d3.curveBasis)
// d corresponds to the data, this will set the points of the graph of the date and temprature.
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

// setting up d3.csv and calling the data file "index.csv".
d3.csv("index.csv", type, function(error, data) {
  if (error) throw error;

//
  var temp = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });
//domains calculating the minimum and maximum values of the array
  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(temp, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(temp, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);
// calculation the z, the chart itself
  z.domain(temp.map(function(c) { return c.id; }));

// g is used as an reffernce point used to display the data in the right places. Above you can see the withs and heights of the g. Adding a class and x axis here.
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
// calling the function mentioned between the brackets, this makes the x axis.
      .call(d3.axisBottom(x));
// appending attributes for the y axis.
  g.append("g")
      .attr("class", "axis axis--y")
// calling the function mentioned between the brackets, this makes the y axis.
      .call(d3.axisLeft(y))
// appending some values that are shown on the y axis.
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºC");


  var chart = g.selectAll(".chart")
    .data(temp)
    .enter().append("g")
      .attr("class", "chart");

// makes path on the chart. adding the class and line and styling the line.
  chart.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });
// displaying the values on the y axis based on the values of the data.
  chart.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});
//setting the date, and looping through it
function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

