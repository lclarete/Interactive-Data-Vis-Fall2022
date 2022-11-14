/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;

/* LOAD DATA */
// d3.json("https://gist.githubusercontent.com/d3noob/3aa3bbe05ee97b35af660c25ee27213b/raw/63e86d4267d42c153d29f4332f932468f28064a7/data.csv", d3.autoType)
//   .then(data => {
//     console.log(data)

//     /* SCALES */
    
//     /* HTML ELEMENTS */
    
//   });

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d['Log GDP per capita']); })
    .y(function(d) { return y(d['Social support']); });

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
d3.csv("https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/world-happiness-report_2020.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d['Log GDP per capita'] = +(d['Log GDP per capita']);
      d['Social support'] = +d['Social support'];
      d['Perceptions of corruption'] = +d['Perceptions of corruption']
      d['Freedom to make life choices'] = +d['Freedom to make life choices']
  });

  var color = d3.scaleOrdinal(data.map(d => d['Freedom to make life choices']), d3.schemeCategory10)

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d['Log GDP per capita']; }));
  y.domain([ d3.min(data, function(d) { return d['Social support']; }), d3.max(data, function(d) { return d['Social support']; })]);

  var z = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d['Perceptions of corruption']; }))
    .range([ 3, 10])

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", function(d) { return z(d['Perceptions of corruption']); })
      .attr("cx", function(d) { return x(d['Log GDP per capita']); })
      .attr("cy", function(d) { return y(d['Social support']); })
      .attr('fill' , '#090262')
      .attr("fill", d => color(d['Freedom to make life choices']));

      // text label
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Social Support"); 
  
      // text label for the x axis
      svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                          (height + margin.top +10) + ")")
      .style("text-anchor", "middle")
      .text('Log GDP per capita');

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});