
let catenaryPoints = 50;
let catenarysN     = 5;
let c              = 200;

var axisColor = "rgb(200, 200,230)";

let posX = tf.linspace(1,2000,catenarysN).arraySync();
let posY = tf.onesLike(posX).mul(100).arraySync();
let posZ = tf.randomUniform([1,catenarysN],50,200).arraySync();

let nodes = [posX,posY,posZ[0]]

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


    plotCatenarys()
}


function plotCatenarys(){

    for (let i = 0; i < catenarysN-1; i++) {

        var x1 = nodes[0][i];
        var y1 = nodes[1][i];
        var z1 = nodes[2][i];

        var x2 = nodes[0][i+1];
        var y2 = nodes[1][i+1];
        var z2 = nodes[2][i+1];

        tracesArray.push( catenary3D(x1,y1,z1,x2,y2,z2) );
    };

    var layout = {

        width:  divSizeW,
        height: divSizeH,

        scene:{

            aspectratio: {x:1, y:1, z:0.2},
            xaxis:{ backgroundcolor: axisColor, gridcolor: "rgb(255,255,255)", showbackground: true, zerolinecolor: "rgb(0,0,0)"},
            yaxis:{ backgroundcolor: axisColor ,gridcolor: "rgb(255,255,255)", showbackground: true, zerolinecolor: "rgb(255, 255, 255)"},
            zaxis:{ backgroundcolor: axisColor ,gridcolor: "rgb(255,255,255)", showbackground: true, zerolinecolor: "rgb(0,0,0)"},
        },

        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
            pad: 1
          },
      };

    Plotly.newPlot( plotID, tracesArray, layout)
};

function catenary3D(x1,y1,z1,x2,y2,z2){

    // Input Points  : x1, y1, z1, x2, y2, z2
    // Output Vectors: x_, y_, z_
    
    var dx = x2-x1;
    var dy = y2-y1;

    var x22   = x1 + Math.ssqrt( dx**2+dy**2);
    var angle = Math.atan2d(dy,dx);

    var x = tf.linspace(x1,x22,catenaryPoints);
    var y = tf.onesLike(x).mul(y1);
       
    // matlab representation
    // var k  = 1/(2*c);
    // var a  = x2-x1;
    // var b  = z2-z1;
    // var c1 = asinh((k*b)/(sinh(k*a)))-k*a;
    // var c2 = -c*cosh(c1);
    // var z  = z1 + c*cosh( (x-x1)/c +c1 ) + c2;
    
    // tensorFlow representation catenary
    var k  = 1/(2*c);
    var a  = x22-x1;
    var b  = z2-z1;
    var c1 = Math.asinh((k*b)/(Math.sinh(k*a)))-k*a;
    var c2 = -c*Math.cosh(c1);
    var z  = tf.cosh( x.add(-x1).div(c).add(c1) ).mul(c).add(z1+c2);

    var trace = {
                 x: x.arraySync(),
                 y: y.arraySync(),
                 z: z.arraySync(),

                type: 'scatter3d',
                mode: 'lines',
                showlegend: false,
                line:   {color: 'red',width: 1},
                marker: {size: 1,color:'white'},   
                  
                }

    return trace 
};








function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};



