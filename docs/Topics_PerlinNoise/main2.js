

let noiseObject = new PerlinNoise();
var divSize     = 900;
var id0         = 'plot0';


function setup() {

    createCanvas(windowWidth,windowHeight, WEBGL);
    angleMode(DEGREES);strokeWeight(5);

    frameRate(3);

    createDiv('')
                 .id(id0)
                 .position(windowWidth/2-divSize/2,windowHeight/2-divSize/2)
                 .style('border','2px solid');

    plot3D(id0);
}


function plot3D(id){

    var N = 500;
    var X = myUtils.linspace(0,N,N);
    var Y = myUtils.linspace(0,N,N) ;
    var Z = [];

    for (let y = 0; y < N-1; y++) {

        var row = [];
        for (let x = 0; x < N; x++) {

            // Noise2D generally returns a value approximately in the range [-1.0, 1.0]
            let z    = noiseObject.evalFractal(x, y);
            let zMap = map(z,-1,1,100,200)
            //let z = noise(x*0.001, y*0.001)*100;
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
        colorscale:'Viridis',
        x: X,
        y: Y,
        z: Z,
        contours: {
            z: {
              show:true,
              //usecolormap: true,
              highlightcolor:"white",
              //project:{z: false}
            }
          }
        }
    ];

    var layout = {
        // title: {text:`<b>${txtTitle}: ${interp.toFixed(4)} `,font:{size:12}},
        // showlegend: false,
        width:  divSize,
        height: divSize,

        scene:{

            aspectratio: {x:1, y:1, z:0.2},
            xaxis:{ backgroundcolor: "rgb(230, 200,230)",
                    gridcolor: "rgb(255,255,255)",
                    showbackground: true,
                    zerolinecolor: "rgb(0,0,0)",
            },
            yaxis:{ backgroundcolor: "rgb(230, 200,230)",
                    gridcolor: "rgb(255,255,255)",
                    showbackground: true,
                    zerolinecolor: "rgb(255, 255, 255)",
            },
            zaxis:{ backgroundcolor: "rgb(230, 200,230)",
                    gridcolor: "rgb(255,255,255)",
                    showbackground: true,
                    zerolinecolor: "rgb(0,0,0)",
           }
        },


        margin: {
            l: 25,
            r: 25,
            b: 35,
            t: 35,
            pad: 2
          },
      };
    Plotly.newPlot(id, data, layout);

}
