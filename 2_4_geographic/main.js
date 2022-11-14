

// set the dimensions and margins of the graph
var margin = {top: 100, right: 200, bottom: 10, left: 10},
    width = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// The svg
const svg = d3.select("#map").attr("width" , width).attr("height" , height);

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0,45])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map()
const colorScale = d3.scaleThreshold()
.domain([-1, -0.5,0,0.5,1])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/map.geojson"), //map data
d3.csv("https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/world-happiness-report_2020.csv", function(d) {
  // console.log('hello', d)
    data.set(d['Country name']
      , +d['Perceptions of corruption'])
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
        d['Perceptions of corruption'] = data.get(d.properties.name) || 0;
        return colorScale(d['Perceptions of corruption']);
      })

  var coordinates = projection([45.1000,15.2000]);

    svg.append("circle")
      .attr("cx", coordinates[0])
      .attr("cy", coordinates[1])
      .attr("r", 5)
      .style("fill", "red");
})
