/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;
var margin = {
  top: 35, 
  bottom: 150, 
  right: 50, 
  left: 70},

width = 820 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var margin2 = {
  top: 30,
  right: 25,
  bottom: 35,
  left: 100
};

width2 = 560 - margin2.left - margin2.right,
height2 = 450 - margin2.top - margin2.bottom;




// // since we use our scales in multiple functions, they need global scope
// let xScale, yScale;

let xScale = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

let yScale = d3.scaleLinear()
      .range([height, 50]);

 let xScale2 = d3.scaleLinear()
      .range([0, width2]);

let yScale2 = d3.scaleBand()
      .range([height2, 0])
      .padding(0.1);

/* APPLICATION STATE */
let state = {
  data: [],
  result:[]
};

/* LOAD DATA */
d3.csv("https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/world-happiness-report_us.csv", d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
//change data to state.data
  var nest = d3.rollups(state.data, v => d3.mean(v, d => d['Log GDP per capita']), d => d['Country name'])

  var BarData = []
  nest.forEach(d=>{
    BarData.push({country:d[0] , value:d[1]})
  })
  console.log('bar' , BarData)

  //sort the data in descending order
  //a-b means ascending order, b-a means descennding order
  var result =  BarData.sort(function(a, b){return b.value - a.value})
  //slice data to keep top 10 only
  state.result = result.slice(0,10)
  console.log('result', state.result , state.result.map(function(d) { return d.country; }))
  
  // Scale the range of the data in the domains
  xScale.domain(state.result.map(function(d) { return d.country; }));
  yScale.domain([d3.min(state.result, function(d) { return d.value; }), d3.max(state.result, function(d) { return d.value; })]).nice();


  yScale2.domain(state.result.map(function(d) { return d.country; }));
  xScale2.domain([d3.min(state.result, function(d) { return d.value; }), d3.max(state.result, function(d) { return d.value; })]).nice();


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state

//yahan daalna svg waly
function draw() {
  /* HTML ELEMENTS */

  var svg = d3.select(div_1).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 

    // append the data/ rectangles for the bar chart
  svg.selectAll(".bar")
  .data(state.result)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return xScale(d.country); })
  .attr("y", function(d) { return yScale(d.value); })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) { return height - yScale(d.value); })
  .attr('fill' , '#01274b')



  // append the axes to the chart 
  // x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  // y Axis
  svg.append("g")
      .call(d3.axisLeft(yScale));

      //add axis labels
      // text label for the y axis
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Log GDP per capita"); 

  // text label for the x axis
  svg.append("text")             
  .attr("transform",
          "translate(" + (width/2) + " ," + 
                      (height + margin.top ) + ")")
  .style("text-anchor", "middle")
  .text("Country");


//-----------------------------===========Second graph-----------------------------
  var svg2 = d3.select(div_2).append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


  // append the data/ rectangles for the bar chart
  svg2.selectAll(".bar")
  .data(state.result)
  .enter()
  .append("rect")
  .attr("x", 0 )
  .attr("y", function(d) { return yScale2(d.country); })
  .attr("width", function(d) { return xScale2(d.value); })
  .attr("height", yScale2.bandwidth() )
  .attr('fill' , '#01274b')

 
      // append the axes to the chart 
      // x Axis
      svg2.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(xScale2));

      // y Axis
      svg2.append("g")
      .call(d3.axisLeft(yScale2));

      //add axis labels
      // text label for the y axis
      svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin2.left)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Log GDP per capita"); 

      // text label for the x axis
      svg2.append("text")             
      .attr("transform",
          "translate(" + (width2/2) + " ," + 
                          (height2 + margin2.top ) + ")")
      .style("text-anchor", "middle")
      .text("Country");
      

}