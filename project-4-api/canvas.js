const jsdom = require('jsdom');                
const virtualDom = new jsdom.JSDOM("<canvas height='400px' width='400px' id='myChart'></canvas>"); // Look back at what Chart.js accepts as an element. Element is the argument, write as a full ONE LINE (the 1 element the chart will take as the argument) html element with a closing tag too
const canvasItem = virtualDom.window.document.getElementById('myChart');
module.exports = { canvasItem }