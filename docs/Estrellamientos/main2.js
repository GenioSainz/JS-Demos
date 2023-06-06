
var NumeroDeVanos = 4;
var dataObject    = {};

for(let i=3;i<=5;i++){
  
        var radio = document.getElementById(`inlineRadio${i}`);
        if(i==NumeroDeVanos){ radio.checked=true };

        radio.addEventListener('input',()=>{

                                        NumeroDeVanos = i;
                                        initLayout();
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

  plotTable();
          
};

function getAllTraces({vanos=defaultV,angulos=defaultA,conductores=defaultC}={}){


  angulos = angulos.map(theta => theta*Math.PI/180);
  calcData(vanos,angulos,conductores);

  var {vanosArray,tensesArray,proyeccionesArray,tenseTotalVec,per1,per2} = dataObject;
  
  var apoyosTraces     = [];
  var semiVanosTraces  = [];
  var vanosTraces      = [];
  var arrowTraces      = [];
  var anottationsArray = [];

  var tensesTraces     = [];

  // subplot Vanos
  for(let i =0;i<NumeroDeVanos;i++){
    
    var vanoi       = vanosArray[i];
    var tensei      = tensesArray[i]
    var proyectioni = proyeccionesArray[i]

    vanosTraces.push({
                      x: [0, vanoi.x],
                      y: [0, vanoi.y],
                      type: 'lines',
                      line:   {color: 'blue',width: 2},
                      xaxis: 'x1',
                      yaxis: 'y1'});

    apoyosTraces.push({
                       x: [vanoi.x],
                       y: [vanoi.y],
                       name: `Apoyo${i+1}`,
                       type: 'scatter',
                       line:   {color: 'blue',width: 2},
                       marker: {size:16,color:'grey',symbol:"square"}, 
                       xaxis: 'x1',
                       yaxis: 'y1'});

    semiVanosTraces.push({
                          x: [vanoi.x/2,proyectioni.x],
                          y: [vanoi.y/2,proyectioni.y],
                          name: `Semivano${i+1}`,
                          type: 'lines+markers',
                          marker: {size:10,color:'red',symbol:"circle-open"}, 
                          line:   {color: 'green',width: 1,dash: 'dot'},
                          xaxis: 'x1',
                          yaxis: 'y1'});

    anottationsArray.push({
                           x: 1.25*vanoi.x,
                           y: 1.25*vanoi.y,
                           font: {size:11,color: 'black'},
                           bgcolor: 'white',
                           bordercolor: '#c7c7c7',
                           xref: 'x1',
                           yref: 'y1',
                           text: `Vano ${i+1}<br>${Math.round(vanoi.norm)}m`,
                           showarrow:false});
  };

  //subplot Tenses
  for(let i =0;i<NumeroDeVanos+1;i++){

    var tensei = tensesArray[i]
    
    if(i==NumeroDeVanos){
      var annotationTxt = `TenseTotal<br>${Math.round(tenseTotalVec.norm)}kp`;
      var colorVector   = 'red'
    }else{
      var annotationTxt = `Tense ${i+1}<br>${conductoresData[conductores[i]].tMax}kp`;
      var colorVector   = 'blue'
    }

    tensesTraces.push({
                      x: [0,tensei.x],
                      y: [0,tensei.y],
                      type: 'lines',
                      line:   {color: colorVector,width: 2},
                      marker: {size:0.1,color:'white'}, 
                      xaxis: 'x2',
                      yaxis: 'y2'});


    var {arrowX,arrowY} = calcArrows(tensei);   

    arrowTraces.push({
                    x: arrowX,
                    y: arrowY,
                    type: 'lines',
                    line:   {color: colorVector ,width: 2},
                    marker: {size:0.1,color:'white'}, 
                    xaxis: 'x2',
                    yaxis: 'y2'});                 
    
    anottationsArray.push({
                          x: tensei.x/2,
                          y: tensei.y/2,
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

  plotTable();

};

function calcData(vanos,angulos,conductores){
  
  var vanosArray        = [];
  var tensesArray       = [];
  var proyeccionesArray = [];
  var conductoresArray  = [];
  var FVArray           = [];
  var FVTotal           = 0;
  var FT                = 0;
  var tenseTotalVec     = new p5.Vector(0,0);
  

  for(let i =0;i<NumeroDeVanos;i++){
    
    var theta  = angulos[i];
    var vanosi = vanos[i];
    var tensei = conductoresData[ conductores[i] ].tMax;
   
    var vanoVec  = new p5.Vector.fromAngle( theta, vanosi);
    var tenseVec = new p5.Vector.fromAngle( theta, tensei);

    tenseTotalVec.add(tenseVec);

    vanoVec.norm  = vanoVec.mag();
    tenseVec.norm = tenseVec.mag();

    vanosArray.push ( vanoVec );
    tensesArray.push( tenseVec );
    conductoresArray.push( conductoresData[ conductores[i] ] )
  };

  tenseTotalVec.norm = tenseTotalVec.mag();
  tensesArray.push(tenseTotalVec);


  var tenseTotalAngle = Math.atan2(tenseTotalVec.y,tenseTotalVec.x);
  var tenseTotalNorm  = tenseTotalVec.norm;
      
  
  if(tenseTotalNorm<1){

    var perMaxNormV = 0;
    var perMaxNormT = 0;

  }else{
    var perMaxNormV = Math.max(...vanos);
    var perMaxNormT = conductoresData[0].tMax;
  }

  var per1 = {
              xVanos:  perMaxNormV * Math.cos(tenseTotalAngle+Math.PI/2), 
              yVanos:  perMaxNormV * Math.sin(tenseTotalAngle+Math.PI/2),
              xTenses: perMaxNormT * Math.cos(tenseTotalAngle+Math.PI/2), 
              yTenses: perMaxNormT * Math.sin(tenseTotalAngle+Math.PI/2)
             };

  var per2 = { 
               xVanos:  perMaxNormV * Math.cos(tenseTotalAngle-Math.PI/2), 
               yVanos:  perMaxNormV * Math.sin(tenseTotalAngle-Math.PI/2),
               xTenses: perMaxNormT * Math.cos(tenseTotalAngle-Math.PI/2), 
               yTenses: perMaxNormT * Math.sin(tenseTotalAngle-Math.PI/2)
              };
  
  for(let i =0;i<NumeroDeVanos;i++){

      var semiVano = vanosArray[i].copy().mult(0.5);
      var per      = new p5.Vector(per1.xVanos,per1.yVanos);

      var proyecionScalar   = p5.Vector.dot(semiVano,per)/p5.Vector.dot(per,per);
      var proyecionVec      = per.mult(proyecionScalar);
          proyecionVec.norm = proyecionVec.mag()   
      proyeccionesArray.push(proyecionVec);
      
      var FVi = (50* proyecionVec.norm*conductoresArray[i].d)/1000 ;
          
      FVTotal+=FVi
      FVArray.push( FVi );
  };
   
  FT = FVTotal + tenseTotalNorm;

  dataObject = {vanosArray,tensesArray,proyeccionesArray,tenseTotalVec,per1,per2,conductoresArray,FVArray,FVTotal,FT}

  return {vanosArray,tensesArray,proyeccionesArray,tenseTotalVec,per1,per2}

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


function plotTable(){

  var tableData = [];
  var numCols   = 4;
  for(let i=0;i<numCols;i++){
    tableData.push([]);
  };

  var tensesArray       = dataObject.tensesArray;
  var proyeccionesArray = dataObject.proyeccionesArray;
  var FVArray           = dataObject.FVArray;
  for(let i=0;i<NumeroDeVanos;i++){
     
    var tx     = Math.round(tensesArray[i].x);
    var ty     = Math.round(tensesArray[i].y);
    var pnorm  = proyeccionesArray[i].norm.toFixed(3);
    var fv     = FVArray[i].toFixed(3);
    tableData[0].push(`Vano${i+1}`);
    tableData[1].push(`[${tx}, ${ty}]`);
    tableData[2].push(`${pnorm}`);
    tableData[3].push(`${fv}`);
  }

  var tx = Math.round(dataObject.tenseTotalVec.x);
  var ty = Math.round(dataObject.tenseTotalVec.y)
  var tt = (dataObject.tenseTotalVec.norm).toFixed(3);
  var FR = (dataObject.tenseTotalVec.norm).toFixed(3);
  var FV = dataObject.FVTotal.toFixed(3);
  var FT = dataObject.FT.toFixed(3);

  tableData[0].push(`TOTAL`);
  tableData[1].push(`[${tx}, ${ty}] = ${tt}`);
  tableData[2].push(``);
  tableData[3].push(`${ FV}`);


    var data = [{
                type: 'table',
                header: {
                  values: [["<b>RESULTADOS </b>"], ["<b>FR: Tense [x,y] (kp)</b>"],["<b>Proyección Semivano (m) PS</b>"],["<b>FV: 50*PS*Diametro (kp)</b>"]],
                  align: "center",
                  line: {width: 1, color: 'black'},
                  fill: {color: "rgba(127,127,127,0.75"},
                  font: {size: 12, color: "white"}
                },
                cells: {
                  values: tableData,
                  height: 30,
                  align: "center",
                  line: {width: 1},
                  font: {size: 12}
                }
                }];

    var layout = {
                  title:`Fuerza Total FT = FR + FV = ${FR}+${FV} = ${FT} kp`,
                  width:  divSizeW,
                  paper_bgcolor:'rgb(245,245,245)',
                  margin:{top:0,pad:1}
                 };
              
           

    Plotly.newPlot('tableID', data,layout,{displayModeBar: false});



}

