function random() {
    return Math.random();
}

function getMax(a){
  return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}

function getVerticleTrace(i) {
  x3List = [ i, i];
  y3List = [0, getMax([y1List, y2List])];
  
  var trace = {
     x: x3List,
     y: y3List,
     mode: 'lines',
     name: 'dashdot',
     line: {
        dash: 'dashdot',
        color: 'red',
        width: 4
     }
   };
   return trace;
}
var N = 20;
var x1List = new Array(N)
var y1List = new Array(N)
var x2List = new Array(N)
var y2List = new Array(N)
var x3List = new Array(N)
var y3List = new Array(N)

for (var i = 0; i < N; i++) {
  x1List[i] = i;
  y1List[i] = 4.5 * random();
} 

for (var i = 0; i < N; i++) {
  x2List[i] = i;
  y2List[i] = 2.2 * random();
} 

var trace1 = {
  x: x1List,
  y: y1List,
  mode: 'lines',
  type: 'scatter',
  name: 'trace 1'
};

  //   x0: '1.2',
  //   y0: 0,
  //   x1: '1.2',
  //   y1: Math.max(...trace1.y), // min of trace y
var trace2 = {
  x: x2List,
  y: y2List,
  mode: 'lines',
  type: 'scatter',
  name: 'trace 2'
};

// for (var i = 0; i < 2; i++) {
//   x3List[i] = i;
//   y3List[i] = 2.2 * random();
// } 

var trace3 = getVerticleTrace(0);


var data = [ trace1, trace2, trace3 ];

// Create a frame for each year. Frames are effectively just
  // traces, except they don't need to contain the *full* trace
  // definition (for example, appearance). The frames just need
  // the parts the traces that change (here, the data).
  var frames = [];
  for (i = 0; i <= N; i++) {
    frames.push({
      name: i,
     // data: [trace1, trace2, trace3Frames]
      data: [trace1, trace2, getVerticleTrace(i)]
        // getData([i], continent);
    })
  }
console.log('frames=', frames)

  // Now create slider steps, one for each frame. The slider
  // executes a plotly.js API command (here, Plotly.animate).
  // In this example, we'll animate to one of the named frames
  // created in the above loop.
  var sliderSteps = [];
  for (i = 0; i <= N ; i++) {
    sliderSteps.push({
      method: 'animate',
      label: i,
      args: [[i], {
        mode: 'immediate',
        transition: {duration: 0,               
                     easing: 'linear'},
        //frame: {duration: 0, redraw: true},
      }]
    });
  }

var layout = {
  xaxis: {
    type: 'dot',
    title: 'Time (s)',
    automargin: true
  },
  yaxis: {
    title: 'Voltage'
  },
  title: 'Test Chart',
  showlegend: false,

sliders: [{
    active: 0,
    pad: {t: 55},
    currentvalue: {
    visible: true,
    prefix: 'Time: ',
    xanchor: 'left',
    font: {size: 20, color: '#666'}
    },
    steps: sliderSteps
}]
};

  Plotly.newPlot('myDiv', {
    data: data,
    layout: layout,
    frames: frames,
  });