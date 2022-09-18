// console.log('hello world');

// defining constants and varialbes to count clicks
const countBtn = document.querySelector('.countBtn button');
const resetBtn = document.querySelector('.resetBtn button');
// store the clicks in a variable
let countNum = document.querySelector('.countNum h1');

// Adding actions to buttons, based on functions
countBtn.addEventListener('click', onclick);
resetBtn.addEventListener('click', reset);

// defining functions
function onclick(){
    // count the number of times a user clicked on a button "Count Up"
    countNum.innerHTML ++;
}

function reset(){
    // reset the counts, restarting it by 0
    countNum.innerHTML = 0;
}

// playing with d3.
// const container = d3.select('.countBtn')
//     .selectAll('button')
//     .data(countNum)
//     .enter()
//     .append('p')
//     .text(dta => dta)
