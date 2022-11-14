/* CONSTANTS AND GLOBALS */

 // set the dimensions and margins of the vertical chart
var margin = {
  top: 35, 
  bottom: 150, 
  right: 50, 
  left: 70},

width = 820 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// margins for the horizontal chart
var margin2 = {
  top: 30,
  right: 25,
  bottom: 35,
  left: 100
};

width2 = 560 - margin2.left - margin2.right,
height2 = 450 - margin2.top - margin2.bottom;


 
// It does not work when I add const in front of the variable
// const width = 500;
// const height = 300;
const data = "https://raw.githubusercontent.com/lclarete/Interactive-Data-Vis-Fall2022/main/data/world-happiness-report_2020.csv"

function make_x_scale(){
  var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
  return x
}

function make_y_scale(){
  var y = d3.scaleLinear()
            .range([height, 50]);
  return y
}

function make_x_scale2(){
  var x = d3.scaleLinear()
            .range([0, width2]);
  return x
}
function make_y_scale2(){
  var y = d3.scaleBand()
          .range([height2, 0])
          .padding(0.1);
  return y
}

function select_html_element(selector){
  /* HTML ELEMENTS */
  /** Select your container and append the visual elements to it */
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(selector).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return svg
}

function select_html_element2(selector){
  /* HTML ELEMENTS */
  /** Select your container and append the visual elements to it */
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(selector).append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  return svg
}


function append_axis(svg_element){
  svg_element.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // y Axis
  svg_element.append("g")
    .call(d3.axisLeft(y));
}

// chart 1
/* LOAD DATA */
d3.csv(data, d3.autoType)
  .then(data => {
    // SCALES: from data to pixel space - set the axes ranges
    var x = make_x_scale()
    var y = make_y_scale()

    var nest = d3.rollups(data, v => d3.mean(v, d => d['Log GDP per capita']), d => d['Country name'])

    var BarData = []
    nest.forEach(d=>{
      BarData.push({country:d[0] , value:d[1]})
    })
    console.log('bar' , BarData)

    //sort the data in descending order
    //a-b means ascending order, b-a means descennding order
    var result =  BarData.sort(function(a, b){return b.value - a.value})
    //slice data to keep top 10 only
    result = result.slice(0,10)
    console.log('result', result)
    
    // Scale the range of the data in the domains
    x.domain(result.map(function(d) { return d.country; }));
    y.domain([d3.min(result, function(d) { return d.value; }), d3.max(result, function(d) { return d.value; })]).nice();

  /* HTML ELEMENTS */
    var svg = select_html_element(div_1)

// append the data/ rectangles for the bar chart
    svg.selectAll(".bar")
      .data(result)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.country); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr('fill' , '#01274b')


// append the axes to the chart 
// x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

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

});


// ---------------------------------second chart horizontal---------------------------

d3.csv(data, d3.autoType)
.then(data => {
  // SCALES: from data to pixel space - set the axes ranges
  var x = make_x_scale2()
  var y = make_y_scale2()

  var nest = d3.rollups(data, v => d3.mean(v, d => d['Log GDP per capita']), d => d['Country name'])

  var BarData = []
  nest.forEach(d=>{
    BarData.push({country:d[0] , value:d[1]})
  })
  console.log('bar' , BarData)

  //sort the data in descending order
  //a-b means ascending order, b-a means descennding order
  var result =  BarData.sort(function(a, b){return b.value - a.value})
  //slice data to keep top 10 only
  result = result.slice(0,10)
  console.log('result2', result)
  
  // Scale the range of the data in the domains
  y.domain(result.map(function(d) { return d.country; }));
  x.domain([d3.min(result, function(d) { return d.value; }), d3.max(result, function(d) { return d.value; })]).nice();

/* HTML ELEMENTS */
  var svg2 = select_html_element2(div_2)

    // append the data/ rectangles for the bar chart
    svg2.selectAll(".bar")
    .data(result)
    .enter()
    .append("rect")
    .attr("x", 0 )
    .attr("y", function(d) { return y(d.country); })
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr('fill' , '#01274b')

   
  // append the axes to the chart 
  // x Axis
  svg2.append("g")
  .attr("transform", "translate(0," + height2 + ")")
  .call(d3.axisBottom(x));

  // y Axis
  svg2.append("g")
  .call(d3.axisLeft(y));

  //add axis labels
  // text label for the y axis
  svg2.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin2.left)
  .attr("x",0 - (height2 / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Country"); 

  // text label for the x axis
  svg2.append("text")             
  .attr("transform",
      "translate(" + (width2/2) + " ," + 
                    (height2 + margin2.top ) + ")")
  .style("text-anchor", "middle")
  .text("Log GDP per capita");

});