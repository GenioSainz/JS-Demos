
var id0        = 'plot0';
var divPad     = 50;
var divSizeW
var divSizeH
var dataObject = {};

var catenaryPoints = 20;
var cCatenary      = 400;
var nTowers        = 8;

function setup() {
    
    createCanvas(windowWidth,windowHeight);noiseSeed(24);

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

        catenarysArray.push( catenary3D(xai,yai,zi-1,xaf,yaf,zf-1)  );
        catenarysArray.push( catenary3D(xbi,ybi,zi-1,xbf,ybf,zf-1)  );
        catenarysArray.push( catenary3D(xci,yci,zi-1,xcf,ycf,zf-1)  );

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


function catenary3D(x1,y1,z1,x2,y2,z2){

    // Input Points  : x1, y1, z1, x2, y2, z2
    // Output Vectors: x_, y_, z_
    
    var dx = x2-x1;
    var dy = y2-y1;

    var x22   = x1 + Math.sqrt( dx**2+dy**2);
    var angle = Math.atan2(dy,dx);

    var x = tf.linspace(x1,x22,catenaryPoints);
    var y = tf.onesLike(x).mul(y1);
    var c = cCatenary;
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

    var traceCatenary = {
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

    return traceCatenary
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
