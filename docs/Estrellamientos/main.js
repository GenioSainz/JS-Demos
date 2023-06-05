

var NumeroDeVanos  = 3;

var stepVanos           = 5;
var stepAngles          = 10;
var slidersPaddingRight = 20;
var sliderStepFont      = 12;
var slidersTopPad       = 100;

var conductoresData = [ {name:'T-25', tMax:500,d: 31.08 },
                        {name:'T-50', tMax:500,d: 36.85 },
                        {name:'T-95', tMax:500,d: 45.05 }, 
                        {name:'T-150',tMax:900,d: 47.44 }];  

var divSizeW = window.innerWidth  - 50;
var divSizeH = window.innerHeight - 50;


var defaultV = [40,50,60];
var defaultA = [0,120,200];
var defaultC = [1,2,3];



initPlot();

function calcArrows(tense,theta){
         
         var dx = 50;
         var dy = dx*3;
         var x  = [-dx,0,+dx];
         var y  = [-dy,0,-dy];

        // tenses[i].x

        function rot(x,y,theta){
                 
                 var x_ = x*Math.cos(theta) - y*Math.sin(theta);
                 var y_ = x*Math.sin(theta) + y*Math.cos(theta)
        }

}

function sliderConductorStep(){

  const sliderConductores = [];
  for (let i = 0; i < 4; i++) {
     
    sliderConductores.push({
          label: conductoresData[i].name,
          execute: true,
          method: 'animate',
          args: [],
        });
  };

  return sliderConductores
};

function sliderAnglesStep(){

    const sliderAngles = [];
    for (let i = 0; i <= 360; i++) {
       
      if(i%stepAngles==0){
          sliderAngles.push({
            label: i + '°',
            execute: true,
            method: 'animate',
            args: [],
          });
      }
    };

    return sliderAngles
};

function sliderVanosStep(){

  const sliderVanos = [];
  for (let i = 0; i <= 100; i++) {
   
    if(i%stepVanos==0){
        sliderVanos.push({
          label: i + 'm',
          execute: true,
          method: 'animate',
          args: []
        });
    }
  };

  return sliderVanos
};

function getAllTraces({vanos=defaultV,angulos=defaultA,conductores=defaultC}={}){


  angulos    = angulos.map(theta => theta*Math.PI/180);
  var {tenses,tenseTotal,per1,per2,proyecciones} = proyections(vanos,angulos,conductores);

  var apoyosTraces     = [];
  var semiVanosTraces  = [];
  var vanosTraces      = [];
  var arrowTraces      = [];
  var anottationsArray = [];

  var tensesTraces     = [];

  // subplot Vanos
  for(let i =0;i<NumeroDeVanos;i++){
    
    var vanoi      = vanos[i];
    var the        = angulos[i];
    var proyection = proyecciones[i]

    vanosTraces.push({
                      x: [0, vanoi*Math.cos(the)],
                      y: [0, vanoi*Math.sin(the)],
                      type: 'lines',
                      line:   {color: 'blue',width: 2},
                      xaxis: 'x1',
                      yaxis: 'y1'});

    apoyosTraces.push({
                       x: [vanoi*Math.cos(the)],
                       y: [vanoi*Math.sin(the)],
                       name: `Apoyo${i+1}`,
                       type: 'scatter',
                       line:   {color: 'blue',width: 2},
                       marker: {size:16,color:'grey',symbol:"square"}, 
                       xaxis: 'x1',
                       yaxis: 'y1'});

    semiVanosTraces.push({
                          x: [vanoi*Math.cos(the)/2,proyection.x],
                          y: [vanoi*Math.sin(the)/2,proyection.y],
                          name: `Semivano${i+1}`,
                          type: 'lines+markers',
                          marker: {size:10,color:'red',symbol:"circle-open"}, 
                          line:   {color: 'green',width: 1,dash: 'dot',},
                          xaxis: 'x1',
                          yaxis: 'y1'});

    anottationsArray.push({
                           x: 1.25*vanoi*Math.cos(the),
                           y: 1.25*vanoi*Math.sin(the),
                           font: {size:11,color: 'black'},
                           bgcolor: 'white',
                           bordercolor: '#c7c7c7',
                           xref: 'x1',
                           yref: 'y1',
                           text: `Vano ${i+1}<br>${vanoi}m`,
                           showarrow:false});
  };


  //subplot Tenses
  for(let i =0;i<NumeroDeVanos+1;i++){
    
    if(i==NumeroDeVanos){
      var annotationTxt = `TenseTotal<br>${Math.round(tenseTotal.norm)}kp`;
      var colorVector   = 'red'
    }else{
      var annotationTxt = `Tense ${i+1}<br>${conductoresData[conductores[i]].tMax}kp`;
      var colorVector   = 'blue'
    }

    tensesTraces.push({
                      x: [0,tenses[i].x],
                      y: [0,tenses[i].y],
                      type: 'lines',
                      line:   {color: colorVector,width: 2},
                      marker: {size:0.1,color:'white'}, 
                      xaxis: 'x2',
                      yaxis: 'y2'});

    arrowTraces.push({
                    x: [0,tenses[i].x],
                    y: [0,tenses[i].y],
                    type: 'lines',
                    line:   {color: colorVector,width: 2},
                    marker: {size:0.1,color:'white'}, 
                    xaxis: 'x2',
                    yaxis: 'y2'});                 

    anottationsArray.push({
                          x: tenses[i].x/2,
                          y: tenses[i].y/2,
                          font: {size:11,color: 'black'},
                          bgcolor: 'white',
                          bordercolor: '#c7c7c7',
                          xref: 'x2',
                          yref: 'y2',
                          text: annotationTxt,
                          showarrow:false});


  };


  var normPlotVanos = { x: [0, per1.xVanos, undefined, 0, per2.xVanos],
                        y: [0, per1.yVanos, undefined, 0, per2.yVanos],
                        type: 'lines',
                        line:   {color: 'green',width: 2},
                        marker: {size:0.1,color:'white'}, 
                        xaxis: 'x1',
                        yaxis: 'y1'}

  var normPlotTenses = { x: [0, per1.xTenses, undefined, 0, per2.xTenses],
                         y: [0, per1.yTenses, undefined, 0, per2.yTenses],
                         type: 'lines',
                         line:   {color: 'green',width: 2},
                         marker: {size:0.1,color:'white'}, 
                         xaxis: 'x2',
                         yaxis: 'y2'}

  
  var tracesArray = [...vanosTraces,...apoyosTraces,...semiVanosTraces, ...tensesTraces, normPlotVanos, normPlotTenses];
  
  return {tracesArray, anottationsArray}

}

function initPlot(){
  

   var {tracesArray, anottationsArray} = getAllTraces();

  
  var layout = {

      width:  divSizeW,
      height: divSizeH,
      showlegend: false,
      xaxis:  {                   showline: true, mirror: 'ticks', dtick:10,  title: 'X [ m ]'},
      yaxis:  { scaleanchor: "x", showline: true, mirror: 'ticks', dtick:10,  title: 'Y [ m ]'},
      xaxis2: {                   showline: true, mirror: 'ticks', dtick:100, title: 'X [ kp ]',},
      yaxis2: { scaleanchor: "x2",showline: true, mirror: 'ticks', dtick:100, title: 'X [ kp ]',},

      grid: {rows: 1, columns: 2, pattern: 'independent'},
      
      annotations: anottationsArray,

      sliders: [

        {
          name:'Condutor1',
          font: {color: '#888',size: sliderStepFont},
          active:defaultC[0],
          steps: sliderConductorStep(),
          x: 0,
          len: 0.2,
          pad: {t: slidersTopPad,r:slidersPaddingRight},
          currentvalue: {
            xanchor: 'left',
            prefix: 'Conductor1: ',
            font: {color: '#888',size: 14}},
        },

        {
        name:'Vano1',
        font: {color: '#888',size: sliderStepFont},
        active:defaultV[0]/stepVanos,
        steps: sliderVanosStep(),
        x: 0.2,
        len: 0.4,
        pad: {t: slidersTopPad,r:slidersPaddingRight},
        currentvalue: {
          xanchor: 'left',
          prefix: 'Vano1: ',
          font: {color: '#888',size: 14}},
        },

        {
          name:'Angulo1',
          font: {color: '#888',size: sliderStepFont},
          active:defaultA[0]/stepAngles,
          steps:  sliderAnglesStep(),
          x: 0.6,
          len: 0.4,
          pad: {t: slidersTopPad},
          currentvalue: {
            xanchor: 'left',
            prefix: 'Angulo1: ',
            font: {color: '#888',size: 14}},
        },

        {
          name:'Condutor2',
          font: {color: '#888',size: sliderStepFont},
          active:defaultC[1],
          steps: sliderConductorStep(),
          x: 0,
          len: 0.2,
          pad: {t: slidersTopPad*2,r:slidersPaddingRight},
          currentvalue: {
            xanchor: 'left',
            prefix: 'Conductor2: ',
            font: {color: '#888',size: 14}},
        },

        {
          name:'Vano2',
          font: {color: '#888',size: sliderStepFont},
          active:defaultV[1]/stepVanos,
          steps: sliderVanosStep(),
          x: 0.2,
          len: 0.4,
          pad: {t: slidersTopPad*2,r:slidersPaddingRight},
          currentvalue: {
            xanchor: 'left',
            prefix: 'Vano2: ',
            font: {color: '#888',size: 14}},
          },
  
          {
            name:'Angulo2',
            font: {color: '#888',size: sliderStepFont},
            active:defaultA[1]/stepAngles,
            steps:  sliderAnglesStep(),
            x: 0.6,
            len: 0.4,
            pad: {t: slidersTopPad*2},
            currentvalue: {
              xanchor: 'left',
              prefix: 'Angulo2: ',
              font: {color: '#888',size: 14}},
          },

          {
            name:'Condutor3',
            font: {color: '#888',size: sliderStepFont},
            active:defaultC[2],
            steps: sliderConductorStep(),
            x: 0,
            len: 0.2,
            pad: {t: slidersTopPad*3,r:slidersPaddingRight},
            currentvalue: {
              xanchor: 'left',
              prefix: 'Conductor3: ',
              font: {color: '#888',size: 14}},
          },

          {
            name:'Vano3',
            font: {color: '#888',size: sliderStepFont},
            active:defaultV[2]/stepVanos,
            steps: sliderVanosStep(),
            x: 0.2,
            len: 0.4,
            pad: {t: slidersTopPad*3,r:slidersPaddingRight},
            currentvalue: {
              xanchor: 'left',
              prefix: 'Vano3: ',
              font: {color: '#888',size: 14}},
            },
    
            {
              name:'Angulo3',
              font: {color: '#888',size: sliderStepFont},
              active:defaultA[2]/stepAngles,
              steps:  sliderAnglesStep(),
              x: 0.6,
              len: 0.4,
              pad: {t: slidersTopPad*3},
              currentvalue: {
                xanchor: 'left',
                prefix: 'Angulo3: ',
                font: {color: '#888',size: 14}},
            },    
      ],
      
  };
  
  Plotly.newPlot(plotID, tracesArray, layout);

  document.getElementById('plotID').on('plotly_sliderchange', function (e) {

            updatePlot()
           })
          
};

function updatePlot(){

  var divlLayout = document.getElementById("plotID");

  var vanos       = [];
  var angulos     = [];
  var conductores = []

  // slider index  sliderCond sliderVanos sliderAngulos
  // 0  0 1 2
  // 1  3 4 5
  // 2  6 7 8

  var index = [ [0,1,2], [3,4,5], [6,7,8] ];

  for(let i=0;i<NumeroDeVanos;i++){
      
    
    conductores.push( divlLayout.layout.sliders[ index[i][0] ].active            );
    vanos      .push( divlLayout.layout.sliders[ index[i][1] ].active*stepVanos  );
    angulos    .push( divlLayout.layout.sliders[ index[i][2] ].active*stepAngles );
  }
  var {tracesArray, anottationsArray} = getAllTraces({vanos:vanos,angulos:angulos,conductores:conductores});

  var update = {
                annotations: anottationsArray,

                xaxis:  {                   showline: true, mirror: 'ticks', dtick:10,  title: 'X [ m ]'  },
                yaxis:  { scaleanchor: "x", showline: true, mirror: 'ticks', dtick:10,  title: 'Y [ m ]'  },
                xaxis2: {                   showline: true, mirror: 'ticks', dtick:100, title: 'X [ kp ]' },
                yaxis2: { scaleanchor: "x2",showline: true, mirror: 'ticks', dtick:100, title: 'X [ kp ]' },
              }
  
  var xUpdate = [];
  var yUpdate = [];
  tracesArray.forEach(trace=>{
             
       xUpdate.push( trace.x);
       yUpdate.push( trace.y);
              
  });

  var newTrace  = {'x':xUpdate, 'y': yUpdate};
  Plotly.relayout( plotID, update);
  Plotly.restyle ( plotID, newTrace);

};


function proyections(vanos,angulos,conductores){

  var tenses       = [];
  var proyecciones = [];
  var tenseTotal = {x:0,y:0,norm:0};
  

  for(let i =0;i<NumeroDeVanos;i++){
    
    var the    = angulos[i];
    var vanosi = vanos[i];
    var tensei = conductoresData[ conductores[i] ].tMax;
    var xtense = tensei*Math.cos(the);
    var ytense = tensei*Math.sin(the);
    tenses.push( {x:xtense,y:ytense} );

    tenseTotal.x += xtense;
    tenseTotal.y += ytense;

  };

  tenses.push( {x:tenseTotal.x,y:tenseTotal.y } );

  var tenseTotalAngle = Math.atan2(tenseTotal.y,tenseTotal.x);
  var tenseTotalNorm  = Math.sqrt(tenseTotal.x**2 + tenseTotal.y**2);
      tenseTotal.norm = tenseTotalNorm;
  
  if(tenseTotalNorm<1){

    var perMaxNormV = 0;
    var perMaxNormT = 0;

  }else{
    var perMaxNormV = Math.max(...vanos);
    var perMaxNormT = conductoresData[0].tMax;
  }

  var per1       = {
                    xVanos:  perMaxNormV * Math.cos(tenseTotalAngle+Math.PI/2), 
                    yVanos:  perMaxNormV * Math.sin(tenseTotalAngle+Math.PI/2),
                    xTenses: perMaxNormT * Math.cos(tenseTotalAngle+Math.PI/2), 
                    yTenses: perMaxNormT * Math.sin(tenseTotalAngle+Math.PI/2)
                  };

  var per2       = {xVanos:  perMaxNormV * Math.cos(tenseTotalAngle-Math.PI/2), 
                    yVanos:  perMaxNormV * Math.sin(tenseTotalAngle-Math.PI/2),
                    xTenses: perMaxNormT * Math.cos(tenseTotalAngle-Math.PI/2), 
                    yTenses: perMaxNormT * Math.sin(tenseTotalAngle-Math.PI/2)
                  };
  
  for(let i =0;i<NumeroDeVanos;i++){

    var the    = angulos[i];
    var vanosi = vanos[i];

    var semiVano = new p5.Vector(vanosi*Math.cos(the),vanosi*Math.sin(the)).mult(0.5);
    var per      = new p5.Vector(per1.xVanos,per1.yVanos);

    var proyecionScalar = p5.Vector.dot(semiVano,per)/p5.Vector.dot(per,per);
    var proyecionVec    = per.mult(proyecionScalar);
    
    proyecciones.push(  {x:proyecionVec.x, y:proyecionVec.y, norm:proyecionVec.mag()})

  };
  

  return {tenses,tenseTotal,per1,per2,proyecciones}

};






