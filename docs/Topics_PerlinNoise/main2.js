

let noiseObject = new PerlinNoise();
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
}


function plot3D(id){

    var N = 500;
    var X = myUtils.linspace(0,N,N);
    var Y = myUtils.linspace(0,N,N) ;
    var Z = [];

    var zMin = 0;
    var zMax = 200;
    var f    = 0.005;

    var axisColor = "rgb(200, 200,230)";

    for (let y = 0; y < N; y++) {

        var row = [];
        for (let x = 0; x < N; x++) {

            // Noise2D generally returns a value approximately in the range [-1.0, 1.0]
            // let z    = noiseObject.evalFractal(x, y,{f:0.003});
            // let zMap = map(z,-1,1,100,200)
            let zMap = noise(x*f, y*f)*200;
            // let gridCellSize = 1;
            // zMap = Math.round(zMap/gridCellSize)*gridCellSize
            row.push(`${zMap}`);
        }

        Z.push(row);
    };

    // Plotting the mesh
    var data=[
        {
        opacity:1,
        color:'rgb(300,100,200)',
        type: 'surface',
        colorscale:'Earth',
        x: X,
        y: Y,
        z: Z,
        contours: {
            z: {
              show:true,
              highlightcolor:"white",
              start:zMin,
              end:zMax,
              size: 5,
              highlightwidth:10,
            }
          }
        }
    ];

    var layout = {
        // title: {text:`<b>${txtTitle}: ${interp.toFixed(4)} `,font:{size:12}},
        // showlegend: false,
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

        //    camera: {
        //         center: {x:0, y:0, z:0}, 
        //         eye:    {x:0.1, y:0.1, z:0.1}, 
        //         up:     {x:0, y:0, z:1}
		//    }
        },


        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
            pad: 0
          },
      };

    Plotly.newPlot(id, data, layout)

}


function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};
