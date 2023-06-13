
let catenaryPoints = 1000;
let catenarysN     = 10;
let c              = 200;

//let nodes = [ [100, 100, 50], [250, 100, 70], [400, 100, 100], [600, 100, 80]]

let posX  = tf.linspace(1,2000,catenarysN).arraySync();
let posY  = tf.onesLike(posX).mul(100).arraySync();
let posZ  = tf.linspace(100,300,catenarysN).arraySync();
let nodes = [posX,posY,posZ];

let tracesArray = [];
var plotID      = 'plotID';
var divPad      = 50;
var divSizeW
var divSizeH

function setup() {

    createCanvas(windowWidth,windowHeight);

    divSizeH = windowHeight - 2*divPad;
    divSizeW = windowWidth  - 2*divPad;

    createDiv('')
                 .id(plotID)
                 .position(windowWidth/2-divSizeW/2,windowHeight/2-divSizeH/2)
                 .style('border','2px solid');


    //plot3D(id0);
    plotCatenarys()
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


function plotCatenarys(){

    for (let i = 0; i < catenarysN-1; i++) {

        var x1 = nodes[0][i];
        var y1 = nodes[1][i];
        var z1 = nodes[2][i];

        var x2 = nodes[0][i+1];
        var y2 = nodes[1][i+1];
        var z2 = nodes[2][i+1];

        tracesArray.push( catenary2D(x1,y1,z1,x2,y2,z2) );
    };

    var layout = {
        // title: {text:`<b>${txtTitle}: ${interp.toFixed(4)} `,font:{size:12}},
        // showlegend: false,
        width:  divSizeW,
        height: divSizeH,

        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
            pad: 0
          },
      };

    Plotly.newPlot( plotID, tracesArray, layout)

};

function catenary2D(x1,y1,z1,x2,y2,z2){
       
    // var k  = 1/(2*c);
    // var a  = x2-x1;
    // var b  = z2-z1;
    // var c1 = asinh((k*b)/(sinh(k*a)))-k*a;
    // var c2 = -c*cosh(c1);
    // var z  = z1 + c*cosh( (x-x1)/c +c1 ) + c2;

    console.log(x1,x2)

    var x  = tf.linspace(x1,x2,catenaryPoints);
    var k  = 1/(2*c);
    var a  = x2-x1;
    var b  = z2-z1;
    var c1 = Math.asinh((k*b)/(Math.sinh(k*a)))-k*a;
    var c2 = -c*Math.cosh(c1);
    // var z = z1 + cosh( (x-x1)/c +c1 )*c + c2;
    var   z = tf.cosh( x.add(-x1).div(c).add(c1) ).mul(c).add(z1+c2);
    
    var trace = {
                  x: x.arraySync(),
                  y: z.arraySync(),
                  mode: 'lines',
                  marker: { color: 'rgb(128, 0, 128)', size: 8},
                  line:   { color: 'rgb(128, 0, 128)', width:1}
                };

    return trace 
};


function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};



