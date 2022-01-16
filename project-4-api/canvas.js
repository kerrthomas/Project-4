const jsdom = require('jsdom');                
const virtualDom = new jsdom.JSDOM("<canvas height='400px' width='400px' id='myChart'></canvas>");
const canvasItem = virtualDom.window.document.getElementById('myChart');
module.exports = { canvasItem }