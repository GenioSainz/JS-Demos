

var NumeroDeVanos     = 3;
var NumeroDeVanosMin  = 3;
var NumeroDeVanosMax  = 5;
var NumeroDeVanosStep = 1;

var vMin  = 10;
var vMax  = 110;
var vStep = 1;

var vano1      = Math.round( vMin + (vMax-vMin)*Math.random());
var vano1Min   = vMin;
var vano1Max   = vMax;
var vano1Step  = vStep;

var vano2      = Math.round( vMin + (vMax-vMin)*Math.random());
var vano2Min   = vMin;
var vano2Max   = vMax;
var vano2Step  = vStep;

var vano3      = Math.round( vMin + (vMax-vMin)*Math.random());
var vano3Min   = vMin;
var vano3Max   = vMax;
var vano3Step  = vStep;

var vano4      = Math.round( vMin + (vMax-vMin)*Math.random());
var vano4Min   = vMin;
var vano4Max   = vMax;
var vano4Step  = vStep;

var vano5      = Math.round( vMin + (vMax-vMin)*Math.random());
var vano5Min   = vMin;
var vano5Max   = vMax;
var vano5Step  = vStep;

var aMin  = 0;
var aMax  = 360;
var aStep = 1;

var angulo1      = Math.round(Math.random()*360);
var angulo1Min   = aMin;
var angulo1Max   = aMax;
var angulo1Step  = aStep;

var angulo2      = Math.round(Math.random()*360);;
var angulo2Min   = aMin;
var angulo2Max   = aMax;
var angulo2Step  = aStep;

var angulo3      = Math.round(Math.random()*360);;
var angulo3Min   = aMin;
var angulo3Max   = aMax;
var angulo3Step  = aStep;

var angulo4      = Math.round(Math.random()*360);;
var angulo4Min   = aMin;
var angulo4Max   = aMax;
var angulo4Step  = aStep;

var angulo5      = Math.round(Math.random()*360);;
var angulo5Min   = aMin;
var angulo5Max   = aMax;
var angulo5Step  = aStep;

var conductor1 = ['T25','T50','T95','T150'];
var conductor2 = ['T25','T50','T95','T150'];
var conductor3 = ['T25','T50','T95','T150'];
var conductor4 = ['T25','T50','T95','T150'];
var conductor5 = ['T25','T50','T95','T150'];


var guiNvanos
var guiVanos;
var guiAngulos;
var guiConductores;
var plotID = 'plotID';

var divSizeW = 1200;
var divSizeH = 800;
var maxAxisVanos 

function setup() {
    
  frameRate(2)
    createCanvas(windowWidth, windowHeight);angleMode(DEGREES);

    createDiv('')
    .id(plotID)
    .position(windowWidth/2-divSizeW/2,windowHeight/2-divSizeH/2)
    .style('border','2px solid');

    // guiNvanos = createGui('N° Vanos').setPosition(500,0);
    // guiNvanos.addGlobals('NumeroDeVanos');

    guiConductores = createGui('Conductores').setPosition(0,0);
    guiConductores.id = 'Conductores';
    guiConductores.addGlobals('conductor1','conductor2','conductor3');

    guiVanos = createGui('Vanos ( m )').setPosition(0,320);
    guiVanos.addGlobals('vano1','vano2','vano3')

    guiAngulos = createGui('Angulos ( ° )').setPosition(0,620);
    guiAngulos.addGlobals('angulo1','angulo2','angulo3');

    // gui1 = createGui('Estrellamientos');//.setPoisition(100,100);
    // gui1.addGlobals('NumeroDeVanos');
    
    plotEstrellamientos()
};


function draw() {
  
  background(255);

  plotEstrellamientos()
};


function plotEstrellamientos(){

  var angulos = [angulo1,angulo2,angulo3];
  var vanos   = [vano1,vano2,vano3];
  var vanosTraces      = [];
  var apoyosTraces     = [];
  var semiVanosTraces  = [];
  var anottationsArray = [];
  maxAxisVanos         = max(...vanos);


  for(let i =0;i<NumeroDeVanos;i++){
    
    var lon = vanos[i];
    var the = angulos[i];

    vanosTraces.push( {
                        x: [0, lon*cos(the)],
                        y: [0, lon*sin(the)],
                        type: 'lines',
                        line:   {color: 'blue',width: 2},
                        marker: {size:0.1,color:'white'}, 
                        xaxis: 'x1',
                        yaxis: 'y1',
                      }
    );

    apoyosTraces.push( {
                  x: [lon*cos(the)],
                  y: [lon*sin(the)],
                  type: 'scatter',
                  line:   {color: 'blue',width: 2},
                  marker: {size:10,color:'black'}, 
                  xaxis: 'x1',
                  yaxis: 'y1',
                }
    );

    semiVanosTraces.push( {
            x: [lon*cos(the)/2],
            y: [lon*sin(the)/2],
            type: 'scatter',
            marker: {size:5,color:'green'}, 
            xaxis: 'x1',
            yaxis: 'y1',
          }
    );

    
    anottationsArray.push(

      {
         x: 1.1*lon*cos(the),
         y: 1.1*lon*sin(the),
         xaxis: 'x1',
         yaxis: 'y1',
         text: `Vano ${i+1}`,
         showarrow:false,
       }
   );
    

  }

  
  var trace2 = {
    x: [20, 30, 40],
    y: [50, 60, 70],
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter'
  };

  
  var data = [...vanosTraces,...apoyosTraces,...semiVanosTraces,trace2];
  
  var layout = {
      width:  divSizeW,
      height: divSizeH,
      xaxis: { range: [-maxAxisVanos*1.1,maxAxisVanos*1.1]},
      yaxis: { range: [-maxAxisVanos*1.1,maxAxisVanos*1.1]},
      grid: {rows: 1, columns: 2, pattern: 'independent'},
      annotations:anottationsArray,

        sliders: [{
          pad: {t: 30},

          currentvalue: {
            xanchor: 'right',
            prefix: 'conductor1: ',
            font: {
              color: '#888',
              size: 20
            }
          },

          steps: [{
            label: 'red',
            method: 'restyle',
            args: ['line.color', 'red']
          }, {
            label: 'green',
            method: 'restyle',
            args: ['line.color', 'green']
          }, {
            label: 'blue',
            method: 'restyle',
            args: ['line.color', 'blue']
          }]
          
        }]
      
  };
  
  Plotly.newPlot(plotID, data, layout);


}




