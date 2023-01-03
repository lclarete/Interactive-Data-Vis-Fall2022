/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleLinear()

// // since we use our scales in multiple functions, they need global scope
// let xScale, yScale;

/* APPLICATION STATE */
let state = {
  data: [],
};

/* LOAD DATA */
d3.csv("https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/world-happiness-report_2020.csv", d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;

  state.data.forEach(function(d) {
    d['Log GDP per capita'] = +(d['Log GDP per capita']);
    d['Social support'] = +d['Social support'];
    d['Perceptions of corruption'] = +d['Perceptions of corruption']
});
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */

  x.domain(d3.extent(state.data, function(d) { return d['Log GDP per capita']; }));
  y.domain([ d3.min(state.data, function(d) { return d['Social support']; }), d3.max(state.data, function(d) { return d['Social support']; })]);
  z.domain(d3.extent(state.data, function(d) { return d['Perceptions of corruption']; }))
    .range([ 3, 10])


  draw(); // calls the draw function
}

/* DRAW FUNCTION */ 
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          svg.selectAll("dot")
          .data(state.data)
        .enter().append("circle")
          .attr("r", function(d) { return z(d['Perceptions of corruption']); })
          .attr("cx", function(d) { return x(d['Log GDP per capita']); })
          .attr("cy", function(d) { return y(d['Social support']); })
          .attr('fill' , 'blue')
          .attr('stroke' , 'black');
    
          
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
}