
var NumeroDeVanos = 4;

for(let i=3;i<=5;i++){
  
        var radio = document.getElementById(`inlineRadio${i}`);
        if(i==NumeroDeVanos){ radio.checked=true };

        radio.addEventListener('input',(e)=>{

                                        NumeroDeVanos = i;
                                        initLayout()
                                       });
};

var stepVanos           = 5;
var stepAngles          = 10;
var slidersPaddingRight = 20;

var sliderTitleFont     = 11;
var sliderStepFont      = 11;
var slidersTopPad       = 85;
var Ticklen             = 4;

var conductoresData = [ {name:'T-25', tMax:500,d: 31.08 },
                        {name:'T-50', tMax:500,d: 36.85 },
                        {name:'T-95', tMax:500,d: 45.05 }, 
                        {name:'T-150',tMax:900,d: 47.44 }];  

var divSizeW = window.innerWidth  - 50;
var divSizeH = window.innerHeight;

var defaultV = [30, 40, 50,  50,  70 ];
var defaultA = [0 , 80, 200, 250, 340];
var defaultC = [1 , 2 , 3  , 2  , 3  ];

initLayout();


function initLayout(){
  

  var {tracesArray, anottationsArray} = getAllTraces();

  var layout = {

      width:  divSizeW,
      height: divSizeH,
      paper_bgcolor:'rgb(245,245,245)',
      showlegend:false,
      xaxis:  { domain: [0,0.45],                    showline: true, mirror: 'ticks', dtick:10,  title: 'X [ m ]'},
      yaxis:  { domain: [0,0.95] , scaleanchor: "x", showline: true, mirror: 'ticks', dtick:10,  title: 'Y [ m ]'},
      xaxis2: { domain: [0.55,1],                    showline: true, mirror: 'ticks', dtick:100, title: 'X [ kp ]',},
      yaxis2: { domain: [0,0.95],  scaleanchor: "x2",showline: true, mirror: 'ticks', dtick:100, title: 'X [ kp ]',},

      grid: {rows: 1, columns: 2, pattern: 'independent'},
      annotations: anottationsArray,
      margin: {t: 20},
      sliders: getSliders(),
      
  };
  
  Plotly.newPlot(plotID, tracesArray, layout, {displayModeBar: false,responsive: true});

  document.getElementById('plotID').on('plotly_sliderchange', function (e) {
            updatePlot();
           });
          
};

function getAllTraces({vanos=defaultV,angulos=defaultA,conductores=defaultC}={}){


  angulos = angulos.map(theta => theta*Math.PI/180);

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
                          line:   {color: 'green',width: 1,dash: 'dot'},
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


    var {arrowX,arrowY} = calcArrows(tenses[i]);   

    arrowTraces.push({
                    x: arrowX,
                    y: arrowY,
                    type: 'lines',
                    line:   {color: colorVector ,width: 2},
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

  // Subplot titles
  anottationsArray.push({
        xref: 'paper',
        yref: 'paper',
        x: 0.25,
        y: 1.025,
        xanchor: 'center',
        yanchor: 'center',
        text: 'Gráfico de Vanos',
        font: {size:16},
        showarrow: false
      },
      {
      xref: 'paper',
      yref: 'paper',
      x: 0.775,
      y: 1.025,
      xanchor: 'center',
      yanchor: 'center',
      text: 'Gráfico de Tenses',
      font: {size:16},
      showarrow: false
      },
    );

  var normPlotVanos = { x: [0, per1.xVanos, undefined, 0, per2.xVanos],
                        y: [0, per1.yVanos, undefined, 0, per2.yVanos],
                        type: 'lines',
                        line:   {color: 'green',width: 2,dash: 'dashdot'},
                        marker: {size:0.1,color:'white'}, 
                        xaxis: 'x1',
                        yaxis: 'y1'}

  var normPlotTenses = { x: [0, per1.xTenses, undefined, 0, per2.xTenses],
                         y: [0, per1.yTenses, undefined, 0, per2.yTenses],
                         type: 'lines',
                         line:   {color: 'green',width: 2,dash: 'dashdot'},
                         marker: {size:0.1,color:'white'}, 
                         xaxis: 'x2',
                         yaxis: 'y2'}

  
  var tracesArray = [...vanosTraces,...apoyosTraces,...semiVanosTraces, ...tensesTraces, normPlotVanos, normPlotTenses, ...arrowTraces];
  
  return {tracesArray, anottationsArray}

};

function updatePlot(){

  var divlLayout = document.getElementById("plotID");

  var vanos       = [];
  var angulos     = [];
  var conductores = []

  // slider index  sliderCond sliderVanos sliderAngulos
  // 0  0 1 2        Vano1 
  // 1  3 4 5        Vano2
  // 2  6 7 8        Vano3
  // 3  9 10 11      Vano4
  // 4  12 13 14     Vano5

  var index = [ [0,1,2], [3,4,5], [6,7,8], [9,10,11],[12,13,14] ];

  for(let i=0;i<NumeroDeVanos;i++){
      
    
    conductores.push( divlLayout.layout.sliders[ index[i][0] ].active            );
    vanos      .push( divlLayout.layout.sliders[ index[i][1] ].active*stepVanos  );
    angulos    .push( divlLayout.layout.sliders[ index[i][2] ].active*stepAngles );
  }
  var {tracesArray, anottationsArray} = getAllTraces({vanos:vanos,angulos:angulos,conductores:conductores});

  
  var xUpdate = [];
  var yUpdate = [];
  
  tracesArray.forEach(trace=>{
    
    xUpdate.push( trace.x);
    yUpdate.push( trace.y);
    
  });
  
  var updateAnnotations = { annotations: anottationsArray}
  var updateTraces      = {'x':xUpdate, 'y': yUpdate};

  Plotly.relayout( plotID, updateAnnotations);
  Plotly.restyle ( plotID, updateTraces);

};

function proyections(vanos,angulos,conductores){

  var tenses       = [];
  var proyecciones = [];
  var tenseTotal   = {x:0,y:0,norm:0};
  

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
      
      proyecciones.push(  {x:proyecionVec.x, y:proyecionVec.y, norm:proyecionVec.mag()});

  };
  

  return {tenses,tenseTotal,per1,per2,proyecciones}

};

function getSliders(){
        
          //NumeroDeVanos; // 3,4,5

          var sliderStepsC = sliderConductorStep()
          var sliderStepsV = sliderVanosStep();
          var sliderStepsA = sliderAnglesStep();
          var sliderArray  = [];

          for(let i=1;i<=NumeroDeVanos;i++){

            var sliderVanoi = [      
                                {
                                  name:`Condutor${i}: `,
                                  ticklen:Ticklen,
                                  font: {color: '#888',size: sliderStepFont},
                                  active:defaultC[i-1],
                                  steps: sliderStepsC,
                                  x: 0,
                                  len: 0.2,
                                  pad: {t: slidersTopPad*i,r:slidersPaddingRight},
                                  currentvalue: {
                                    xanchor: 'left',
                                    prefix: `Condutor${i}: `,
                                    font: {color: '#888',size:sliderTitleFont}},
                                },

                                {
                                name:`Vano${i}: `,
                                ticklen:Ticklen,
                                font: {color: '#888',size: sliderStepFont},
                                active:defaultV[i-1]/stepVanos,
                                steps: sliderStepsV,
                                x: 0.2,
                                len: 0.4,
                                pad: {t: slidersTopPad*i,r:slidersPaddingRight},
                                currentvalue: {
                                  xanchor: 'left',
                                  prefix:`Vano${i}: `,
                                  font: {color: '#888',size: sliderTitleFont}},
                                },

                                {
                                  name:`Ángulo${i}: `,
                                  ticklen:Ticklen,
                                  font: {color: '#888',size: sliderStepFont},
                                  active:defaultA[i-1]/stepAngles,
                                  steps:sliderStepsA,
                                  x: 0.6,
                                  len: 0.4,
                                  pad: {t: slidersTopPad*i},
                                  currentvalue: {
                                    xanchor: 'left',
                                    prefix: `Ángulo${i}: `,
                                    font: {color: '#888',size: sliderTitleFont}},
                                },

                              ];  

                              sliderArray.push(...sliderVanoi)
          };

          return sliderArray
};

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

function calcArrows(tense){
         
  var dx      = 15;
  var dy      = dx*3;
  var x       = [-dx,0,+dx];
  var y       = [-dy,0,-dy];
  var theta   = Math.atan2(tense.y,tense.x)-Math.PI/2;
  var arrowX  = [];
  var arrowY  = [];

  for(let i=0;i<3;i++){

    var  {x_,y_} =  rot(x[i],y[i],theta);
    arrowX.push( x_ + tense.x );
    arrowY.push( y_ + tense.y );
  }

 function rot(x,y,theta){
          
          var x_ = x*Math.cos(theta) - y*Math.sin(theta);
          var y_ = x*Math.sin(theta) + y*Math.cos(theta);

          return {x_,y_}
 };

 return {arrowX,arrowY}

}

plotTable()

function plotTable(){

  var values = [
                ['Salaries', 'Office', 'Merchandise', 'Legal', '<b>TOTAL</b>'],
                [1200000, 20000, 80000, 2000, 12120000],
                [1300000, 20000, 70000, 2000, 130902000],
                [1300000, 20000, 120000, 2000, 131222000],
                [1400000, 20000, 90000, 2000, 14102000]
              ];

    var data = [{
                type: 'table',
                header: {
                  values: [["<b>VANO Nº</b>"], ["<b>Q1</b>"],["<b>Q2</b>"], ["<b>Q3</b>"], ["<b>Q4</b>"]],
                  align: "center",
                  line: {width: 1, color: 'black'},
                  fill: {color: "rgba(127,127,127,0.75"},
                  font: {size: 12, color: "white"}
                },
                cells: {
                  values: values,
                  height: 30,
                  align: "center",
                  line: {width: 1},
                  font: {size: 12}
                }
                }];

    var layout = {

                  width:  divSizeW,
                  paper_bgcolor:'rgb(245,245,245)',
                  margin:{top:5,pad:1}
                 };
              
           

    Plotly.newPlot('tableID', data,layout,{displayModeBar: false});



}

