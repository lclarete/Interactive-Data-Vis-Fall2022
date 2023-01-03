/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the year / time
var parseTime = d3.timeParse("%y");

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// // since we use our scales in multiple functions, they need global scope
// let xScale, yScale;
let valueline = d3.line()
  .x(function(d) { return x(d.year); })
  .y(function(d) { return y(d.value); });


/* APPLICATION STATE */
let state = {
    data: [],
  };

  var lineData = []

  
  /* LOAD DATA */
  d3.csv("/data/world-happiness-report.csv", d3.autoType).then(raw_data => {
    console.log("data", raw_data);
    // save our data to application state
    state.data = raw_data;
    state.data.forEach(function(d) {
        d.year = +(d.year);
        d.Generosity = +d.Generosity;
    });

    init();
  });
  

  /* INITIALIZING FUNCTION */
  // this will be run *one time* when the data finishes loading in
  function init() {
    /* SCALES */

    var nest = d3.rollups(state.data, v => d3.mean(v, d => d.Generosity), d => d.year)
    nest.sort(function(a, b){return a[0] - b[0]})
  
    
    nest.forEach(d=>{
      lineData.push({year:d[0] , value:d[1]})
    })
    console.log('nest' , nest , state.data) 

  x.domain(d3.extent(nest, function(d) { return d[0]; }));
  y.domain([ d3.min(nest, function(d) { return d[1]; }), d3.max(nest, function(d) { return d[1]; })]);
  

  
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


        svg.append("path")
        .data([lineData])
        .attr("class", "line")
        .attr("d", valueline)
        .attr('fill' , 'none')
        .attr('stroke' , 'black');

        // text label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Generosity"); 
    
        // text label for the x axis
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top +10) + ")")
        .style("text-anchor", "middle")
        .text('Year');
    

    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
  
  
  }