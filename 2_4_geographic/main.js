

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// The svg
const svg = d3.select("#map").attr("width" , width).attr("height" , height);

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map()
const colorScale = d3.scaleThreshold()
.domain([-1, -0.5,0,0.5,1])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("/data/map.geojson"), //map data
d3.csv("/data/world-happiness-report.csv", function(d) {
  // console.log('hello', d)
    data.set(d['Country name']
      , +d['Generosity'])
})
]).then(function(loadData){
    let topo = loadData[0]
    

    // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d['Generosity'] = data.get(d.properties.name) || 0;
        return colorScale(d['Generosity']);
      })
})
