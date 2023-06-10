
var id0        = 'plot0';
var divPad     = 50;
var divSizeW
var divSizeH
var dataObject = {};

function setup() {
    
    // 18
    createCanvas(windowWidth,windowHeight);noiseSeed(23);

    divSizeH = windowHeight - 2*divPad;
    divSizeW = windowWidth  - 2*divPad;

    createDiv('')
                 .id(id0)
                 .position(windowWidth/2-divSizeW/2,windowHeight/2-divSizeH/2)
                 .style('border','2px solid');
    plot3D(id0);
};



function plot3D(id){

    var N = 500;
    var X = myUtils.linspace(0,N,N);
    var Y = myUtils.linspace(0,N,N);
    var Z = [];

    var nTowers  = 10;
    var towersXY = myUtils.linspace(0,N-1,nTowers);
    
    var zMin   = 0;
    var zMax   = 200;
    var f      = 0.005;
    var towerH = 20;
    
    var axisColor = "rgb(200, 200,230)";

    var terrain         = [];
    var towersArray     = [];
    var catenarysArray  = [];
    var towersTraces    = {};
    
    // Generate Terrain => Z
    ///////////////////////////
    for (let y = 0; y < N; y++) {

        var row = [];
        for (let x = 0; x < N; x++) {

            // Noise2D generally returns a value approximately in the range [-1.0, 1.0]
            // let z    = noiseObject.evalFractal(x, y,{f:0.003});zMap = map(z,-1,1,100,200)
            let zMap = noise(x*f, y*f)*200;
            row.push( zMap );
        }

        Z.push(row);
    };

    var terrain = { 
                    opacity:1, 
                    showlegend: true,
                    name:'Terrain',
                    type: 'surface', 
                    colorscale:'Earth',
                    colorbar:{len:0.6,title:{ text:'Terrain Z (m)',side:'right',font:{size:16}}},
                    x: X,
                    y: Y,
                    z: Z,
                    contours: {
                        z: {
                            show:true,
                            project:{z: false,usecolormap: true,},
                            highlightwidth:10,highlightcolor:"white",
                            start:zMin, end:zMax, size: 5,
                        }
                    }
                  };
   
    // Generate Towers => towersArray
    ////////////////////////////////////
    for(let i=0;i<towersXY.length;i++){
       
        var xi = Math.floor( towersXY[i] );
        var yi = Math.floor( towersXY[i] );
        var z0 = Z[yi][xi];
        var h  = 20;
        var z1 = z0 + towerH;
        var k  = 6;
        var tower = {
                        x: [xi,xi,xi+h/k,xi-h/k],
                        y: [yi,yi,yi-h/k,yi+h/k],
                        z: [z0,z1,z1,z1],
                        showlegend:(i==0)?true:false,
                        legendgroup: 'Towers',
                        name:'Towers',
                        type: 'scatter3d',
                        mode: 'lines',
                        line: { color: 'black',width: 4},
                       }
        towersArray.push( tower );

    };
    
    // Generate Catenarys => catenarysArray
    //////////////////////////////////
    for(let i=0;i<towersXY.length-1;i++){

        var zi = towersArray[i]  .z[1];
        var zf = towersArray[i+1].z[1];
        
        var xai = towersArray[i]  .x[1];
        var yai = towersArray[i]  .y[1];
        var xaf = towersArray[i+1].x[1];
        var yaf = towersArray[i+1].y[1];

        var xbi = towersArray[i]  .x[2];
        var ybi = towersArray[i]  .y[2];
        var xbf = towersArray[i+1].x[2];
        var ybf = towersArray[i+1].y[2];

        var xci = towersArray[i]  .x[3];
        var yci = towersArray[i]  .y[3];
        var xcf = towersArray[i+1].x[3];
        var ycf = towersArray[i+1].y[3];

        var catenary = {
                        x: [xai,xaf,undefined,xbi,xbf,undefined,xci,xcf,undefined],
                        y: [yai,yaf,undefined,ybi,ybf,undefined,yci,ycf,undefined],
                        z: [zi ,zf ,undefined,zi,zf  ,undefined,zi,zf  ,undefined],
        
                        type: 'scatter3d',
                        mode: 'lines+markers',
                        showlegend:(i==0)?true:false,
                        legendgroup: 'Catenarys',
                        name: 'Catenarys',
                        line:   {color: 'red',width: 1},
                        marker: {size: 1,color:'white'},     
                       }
        catenarysArray.push( catenary );

    };


    // Generate Towers traces=> towersTraces
    ////////////////////////////////////
    towersTraces = {
                    x: towersXY,
                    y: towersXY,
                    z: tf.zeros([1, nTowers]).arraySync()[0],
                    type: 'scatter3d',
                    mode: 'markers',
                    showlegend:true,
                    legendgroup: 'Towers Traces',
                    name:'Towers Traces',
                    marker: { color: 'rgb(255,0,0)',symbol: 'circle',opacity: 0.8,size: 4},
            
                    };


    dataObject = {terrain,towersArray,catenarysArray,towersTraces}
    var data = [terrain,...towersArray,...catenarysArray,  towersTraces];
     

    var layout = {
        title: {text:`<b> Procedural Terrain Generated With Perlin Noise 2D`,font:{size:20}},
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
      };

    Plotly.newPlot(id, data, layout,{displayModeBar: false})

}

