
let catenaryPoints = 100;
let catenarysN     = 3+1;
let c              = 200;

let posX  = tf.linspace(1,2000,catenarysN).arraySync();
let posY  = tf.randomUniform([1,catenarysN],1,2000).arraySync().flat();
let posZ  = tf.randomUniform([1,catenarysN],50,200).arraySync().flat();
let nodes = {posX,posY,posZ};

let tracesArray = [];
var axisColor   = "rgb(200, 200,230)";
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

        var x1 = nodes.posX[i];
        var y1 = nodes.posY[i];
        var z1 = nodes.posZ[i];
        var x2 = nodes.posX[i+1];
        var y2 = nodes.posY[i+1];
        var z2 = nodes.posZ[i+1];
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

    var x22   = x1 + Math.sqrt( dx**2+dy**2);
    var angle = Math.atan2(dy,dx);

    var x     = tf.linspace(x1,x22,catenaryPoints);
    var y     = tf.onesLike(x).mul(y1);
       
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
  
  
    var m  = tf.stack([x,y,z]); // tf.concat([x,y,z]).reshape([3,x.shape[0]]);  

    var m_ = translationXYZ(-x1,-y1,0,m);
        m_ = rotZ(angle,m_)
        m_ = translationXYZ(x1,y1,0,m_);
        console.log( m_.slice([0,0], [1, m_.shape[1]]).arraySync().flat())
    var trace = {
                //  x: x.arraySync(),
                //  y: y.arraySync(),
                //  z: z.arraySync(),

                x: m_.slice([0,0], [1, m_.shape[1]]).arraySync().flat(),
                y: m_.slice([1,0], [1, m_.shape[1]]).arraySync().flat(),
                z: m_.slice([2,0], [1, m_.shape[1]]).arraySync().flat(),

                 type: 'scatter3d',
                 mode: 'lines',
                 showlegend: false,
                 line:   {color: 'red',width: 1},
                 marker: {size: 1,color:'white'},   
                };

    return trace 
};

function rotZ(theta,m){

          //   var m     = [x...;
          //                y...;
          //                z...];

          var rot = tf.tensor([ [Math.cos(theta),-Math.sin(theta),0],
                                [Math.sin(theta), Math.cos(theta),0],
                                [0              , 0              ,1]]);     

          var m_ = tf.matMul(rot,m);
          return m_
};

function translationXYZ(dx,dy,dz,m){

        //   var m     = [x...;
        //                y...;
        //                z...];
        // m_ = trans(dx,dy,dz,m)
        //
        //   t  = [1 0 0 dx;
        //         0 1 0 dy;
        //         0 0 1 dz;
        //         0 0 0  1];
        //  
        //   [~, cols] = size(m);
        //   m_        = t * [m;ones(1,cols)];
        //   m_(end,:) = [];

         var t = tf.tensor([[1, 0, 0, dx],
                            [0, 1, 0, dy],
                            [0, 0, 1, dz],
                            [0, 0, 0, 1 ]]);
    
         var mRowOnes = tf.ones([1,m.shape[1]]);
         var mOnes    = tf.concat([m,mRowOnes]);
         var rr       = tf.matMul(t,mOnes);

         return  rr.slice([0, 0], [3, rr.shape[1]]);      
};

function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};



