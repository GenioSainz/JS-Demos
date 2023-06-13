
var plotID = 'plotID',divSizeW,divSizeH;

var catenaryPoints = 20;
var cCatenary      = 400;
var nTowers        = 8;

var catenaryTracesIndex = [];
var SEED                = Math.round(Math.random()*1000);
var dataObject          = {};

function setup() {
    
    createCanvas(windowWidth,windowHeight);
    
    noiseSeed(SEED);
    
    var divPad = 50;
    divSizeH   = windowHeight - 2*divPad;
    divSizeW   = windowWidth  - 2*divPad;

    createDiv('')
                 .id(plotID )
                 .position(windowWidth/2-divSizeW/2,windowHeight/2-divSizeH/2)
                 .style('border','2px solid');

    initLayout(plotID);
    getCatenaryIndex();

    document.getElementById(plotID).on('plotly_sliderchange', function (e) {
        var cCatenary = e.step.value*1;
        updateTraces(cCatenary)
       });

};

function initLayout(id){

    var N       = 500;
    var nTowers = 10;
    var X       = tf.linspace(0,N,N).arraySync();
    var Y       = tf.linspace(0,N,N).arraySync();
    var towersX = tf.linspace(0,N-1,nTowers).arraySync();
    var towersY = tf.linspace(0,N-1,nTowers).arraySync();

    // Generate Terrain => Z
    ///////////////////////////
    var terrain = generateTerrain(X,Y);
   
    // Generate Towers => towersArray
    ////////////////////////////////////
    var towersArray = generateTowers(terrain,towersX,towersY);

    // Generate Catenarys => catenarysArray
    //////////////////////////////////
    var catenarysArray = generateCatenarys(towersArray);
    
    // Data Object
    /////////////////
    dataObject = {terrain,towersArray,catenarysArray};

    var data   = [terrain,...towersArray,...catenarysArray];

    var axisColor = "rgb(200, 200,230)";

    var layout    = {
                    title: {text:`<b> Procedural Terrain Generated With Perlin Noise 2D Seed: ${SEED}`,font:{size:20}},
                    width:  divSizeW,
                    height: divSizeH,
                    showlegend:true,
                    legend:{font:{size:16}},
                    scene:{

                        aspectratio: {x:1, y:1, z:0.2},
                        xaxis:{ backgroundcolor: axisColor ,
                                gridcolor: "rgb(255,255,255)",
                                showbackground: true,
                                zerolinecolor: "rgb(0,0,0)",title:'x (m)'
                        },
                        yaxis:{ backgroundcolor: axisColor ,
                                gridcolor: "rgb(255,255,255)",
                                showbackground: true,
                                zerolinecolor: "rgb(255, 255, 255)",title:'y (m)'
                        },
                        zaxis:{ backgroundcolor: axisColor ,
                                gridcolor: "rgb(255,255,255)",
                                showbackground: true,
                                zerolinecolor: "rgb(0,0,0)",title:'z (m)'
                    },
                    },
                    margin: {
                        l: 25,
                        r: 25,
                        b: 25,
                        t: 50,
                        pad: 2
                    },

                    sliders: getSlider()
                };

                Plotly.newPlot(id, data, layout,{displayModeBar: false})

}



function getSlider(){
    
    var slidersPaddingRight = 0;
    var slidersTopPad       = 1;
    var sliderTitleFont     = 11;
    var sliderStepFont      = 11;
    var Ticklen             = 4;
    var sliderSteps         = []

    var Cmin   = 50;
    var Cmax   = 1000;
    var Cstep  = 50; 
    var Cvalue = 600

    for (let i = Cmin; i <= Cmax; i+=Cstep) {
        
        sliderSteps.push({
                            label: `${i}`,
                            execute: true,
                            method: 'animate',
                            args: [],
                         });
    };

    var slider = {
                    name:`CatenaryParameterC:`,
                    ticklen:Ticklen,
                    font: {color: '#888',size: sliderStepFont},
                    active: Cvalue/Cstep-Cmin/Cstep,
                    steps: sliderSteps, //steps
                    x: 0,
                    len: 0.5,
                    pad: {t: slidersTopPad,r:slidersPaddingRight},
                    currentvalue: {
                        xanchor: 'left',
                        prefix: `Parameter C: `,
                        font: {color: '#888',size:sliderTitleFont}},
                 };

    return [slider]

};

function getCatenaryIndex(){

    var graphDiv = document.getElementById(plotID);

        graphDiv.data.forEach((trace, index)=>{

            if(trace.name=='catenary'){

                catenaryTracesIndex.push(index)
            };
        });
};

function updateTraces(cCatenary){

    var towersArray = dataObject.towersArray

    var xUpdate = [];
    var yUpdate = [];
    var zUpdate = [];
    var ia      = 1;
    var ib      = 2;
    var ic      = 3;
   
    for(let i=0;i<towersArray.length-1;i++){
         
         var toweri  = towersArray[i];
         var towerf  = towersArray[i+1];
         var traceA = catenary3D(toweri.x[ia],toweri.y[ia],toweri.z[ia],towerf.x[ia],towerf.y[ia],towerf.z[ia],cCatenary,i);
         var traceB = catenary3D(toweri.x[ib],toweri.y[ib],toweri.z[ib],towerf.x[ib],towerf.y[ib],towerf.z[ib],cCatenary,i); 
         var traceC = catenary3D(toweri.x[ic],toweri.y[ic],toweri.z[ic],towerf.x[ic],towerf.y[ic],towerf.z[ic],cCatenary,i); 

         xUpdate.push(traceA.x);xUpdate.push(traceB.x);xUpdate.push(traceC.x);
         yUpdate.push(traceA.y);yUpdate.push(traceB.y);yUpdate.push(traceC.y);
         zUpdate.push(traceA.z);zUpdate.push(traceB.z);zUpdate.push(traceC.z);
    };

    var updateTraces = {'x': xUpdate, 'y':yUpdate,'z':zUpdate};

    Plotly.restyle ( plotID, updateTraces,{},catenaryTracesIndex);

    // var gd = document.getElementById(plotID);
    // var d  = gd.data   // => current data
    // var l  = gd.layout // => current layout
    // return {d,l}
};