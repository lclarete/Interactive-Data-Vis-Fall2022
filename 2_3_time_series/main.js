// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the year / time
var parseTime = d3.timeParse("%y");

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

var valueArea = d3.area()
    .x(function(d) { return x(d.year); })
    .y0(innerHeight)
    .y1(function(d) { return y(d.value);
    });


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/world-happiness-report_us.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.year = +(d.year);
      d['Perceptions of corruption'] = +d['Perceptions of corruption'];
  });
  
//   var nest = d3.rollups(data, v => d3.max(v, d => d['Log GDP per capita']), d => d.year);
  var nest = d3.rollups(data, v => d3.min(v, d => d['Perceptions of corruption']), d => d.year)
  nest.sort(function(a, b){return a[0] - b[0]})

  var lineData = []
  nest.forEach(d=>{
    lineData.push({year:d[0] , value:d[1]})
  })

  // Scale the range of the data
  x.domain(d3.extent(nest, function(d) { return d[0]; }));
  y.domain([d3.min(nest, function(d) { return d[1]; }), d3.max(nest, function(d) { return d[1]; })]);

  // Add the valueline path.
  svg.append("path")
      .data([lineData])
      .attr("class", "line")
      .attr("d", valueArea)

       // text label
       svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left)
       .attr("x",0 - (height / 2))
       .attr("dy", "0.8em")
       .style("text-anchor", "middle")
       .text("Log GDP per capita"); 
   
       // text label for the x axis
       svg.append("text")             
       .attr("transform",
             "translate(" + (width/2) + " ," + 
                           (height + margin.top +10) + ")")
       .style("text-anchor", "middle")
       .text('Year');
 

  // Add the x Axis
  svg.append("g")
    .attr('class', 'xaxis')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the y Axis
  svg.append("g")
  .attr('class', 'yaxis')
  .call(d3.axisLeft(y));

});