
var id0         = 'plot0';
var divPad      = 50;
var divSizeW
var divSizeH

function setup() {

    createCanvas(windowWidth,windowHeight);

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
    
    
    var zMin   = 0;
    var zMax   = 200;
    var f      = 0.005;
    var towerH = 20;
    
    var axisColor = "rgb(200, 200,230)";

    var towersArray = [];
    var linesArray  = [];
    var terrain     = [];
    
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
                    opacity:1, type: 'surface', colorscale:'Earth',
                    x: X, y: Y, z: Z,
                    contours: {
                        z: {
                            show:true,
                            highlightwidth:10,highlightcolor:"white",
                            start:zMin, end:zMax, size: 5,
                        }
                    }
                  };
   
    // Generate Towers => towersArray
    ////////////////////////////////////
    var towersXY = myUtils.linspace(0,N-1,15)
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
        
                        type: 'scatter3d',
                        mode: 'lines',
                        showlegend: false,
                        line: { color: 'black',width: 4},
                       }
        towersArray.push( tower );

    };
    
    // Generate Lines => linesArray
    //////////////////////////////////
    for(let i=0;i<towersXY-1;i++){

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

        var line = {
                        x: [xai,xaf,undefined,xbi,xbf,undefined,xci,xcf,undefined],
                        y: [yai,yaf,undefined,ybi,ybf,undefined,yci,ycf,undefined],
                        z: [zi ,zf ,undefined,zi,zf  ,undefined,zi,zf  ,undefined],
        
                        type: 'scatter3d',
                        mode: 'lines+markers',
                        showlegend: false,
                        line:   {color: 'red',width: 1},
                        marker: {size: 1,color:'white'},     
                       }
        linesArray.push( line );

    }

    console.log(linesArray)

    //var data = [terrain];
    var data = [terrain,...towersArray,...linesArray];

    var layout = {
        title: {text:`<b> Procedural Terrain Generated With Perlin Noise`,font:{size:16}},
        width:  divSizeW,
        height: divSizeH,

        scene:{

            aspectratio: {x:1, y:1, z:0.2},
            xaxis:{ backgroundcolor: axisColor ,
                    gridcolor: "rgb(255,255,255)",
                    showbackground: true,
                    zerolinecolor: "rgb(0,0,0)",
            },
            yaxis:{ backgroundcolor: axisColor ,
                    gridcolor: "rgb(255,255,255)",
                    showbackground: true,
                    zerolinecolor: "rgb(255, 255, 255)",
            },
            zaxis:{ backgroundcolor: axisColor ,
                    gridcolor: "rgb(255,255,255)",
                    showbackground: true,
                    zerolinecolor: "rgb(0,0,0)",
           },
        },
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
            pad: 1
          },
      };

    Plotly.newPlot(id, data, layout)

}


// function windowResized() {

//     window.location.reload();
//     resizeCanvas(windowWidth, windowHeight);
// };
