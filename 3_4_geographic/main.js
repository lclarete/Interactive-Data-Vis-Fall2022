/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;

// // since we use our scales in multiple functions, they need global scope
// let xScale, yScale;

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
let colorScale

/* APPLICATION STATE */
let state = {
    mapdata: [],
    data : new Map()
};

/* LOAD DATA */
Promise.all([
  d3.json("/data/map.geojson"), //map data
  d3.csv("/data/world-happiness-report.csv", function(d) { state.data.set(d['Country name'], +d['Generosity'])})
  ]).then(function(loadData){
    state.mapdata = loadData[0]

    init();

  })


/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  colorScale = d3.scaleThreshold()
  .domain([-1, -0.5,0,0.5,1])
    .range(d3.schemeBlues[7]);



  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */

  // The svg
const svg = d3.select("#map").attr("width" , width).attr("height" , height);

  svg.append("g")
  .selectAll("path")
  .data(state.mapdata.features)
  .join("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function (d) {
      d['Generosity'] = state.data.get(d.properties.name) || 0;
      return colorScale(d['Generosity']);
    })
 


}