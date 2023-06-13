
function generateTerrain(X,Y){

    var zMin = 0;
    var zMax = 200;
    var f    = 0.005;
    var Z    = [];

    // Generate Terrain => Z
    ///////////////////////////
    for (let y = 0; y < Y.length; y++) {

        var row = [];
        for (let x = 0; x < X.length; x++) {

            // Noise2D generally returns a value approximately in the range [-1.0, 1.0]
            // let z    = noiseObject.evalFractal(x, y,{f:0.003});zMap = map(z,-1,1,100,200)
            let zMap = noise(x*f, y*f)*200;
            row.push( zMap );
        };

        Z.push(row);
    };

    var terrain = { 
                    name:'Terrain',
                    opacity:1, 
                    showlegend: true,
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

    return terrain;

};

function generateTowers(terrain,X,Y){
     
    var towerH      = 20;
    var armado      = towerH/5;
    var towersArray = [];

    // Generate Towers => towersArray
    ////////////////////////////////////
    for(let i=0;i<X.length;i++){
       
        var xi = Math.floor( X[i] );
        var yi = Math.floor( Y[i] );
        var z0 = terrain.z[yi][xi];
        var z1 = z0 + towerH;
        
        var tower = {
                        name:'Towers',
                        x: [xi,xi,xi+armado,xi-armado],
                        y: [yi,yi,yi-armado,yi+armado],
                        z: [z0,z1,z1,z1],
                        armado:armado,
                        showlegend:(i==0)?true:false,
                        legendgroup: 'Towers',
                        type: 'scatter3d',
                        mode: 'lines',
                        line: { color: 'black',width: 4},
                       }
        towersArray.push( tower );

    };

    return towersArray
};

function generateCatenarys(towersArray){
     
    var catenarysArray = [];

    // Generate Catenarys => catenarysArray
    //////////////////////////////////
    for(let i=0;i<towersArray.length-1;i++){

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

        catenarysArray.push( catenary3D(xai,yai,zi,xaf,yaf,zf,cCatenary)  );
        catenarysArray.push( catenary3D(xbi,ybi,zi,xbf,ybf,zf,cCatenary)  );
        catenarysArray.push( catenary3D(xci,yci,zi,xcf,ycf,zf,cCatenary)  );
    };

    return catenarysArray
}

function catenary3D(x1,y1,z1,x2,y2,z2,c,index=1){

    // Input Points  : x1, y1, z1, x2, y2, z2
    // Output Vectors: x_, y_, z_
    
    var dx = x2-x1;
    var dy = y2-y1;

    var x22   = x1 + Math.sqrt( dx**2+dy**2);
    var angle = Math.atan2(dy,dx);

    var x = tf.linspace(x1,x22,catenaryPoints);
    var y = tf.onesLike(x).mul(y1);

    // matlab representation
    // k  = 1/(2*c);
    // a  = x2-x1;
    // b  = z2-z1;
    // c1 = asinh((k*b)/(sinh(k*a)))-k*a;
    // c2 = -c*cosh(c1);
    // z  = z1 + c*cosh( (x-x1)/c +c1 ) + c2;
    
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
                 name: 'catenary',
                 x:    m_.slice([0,0], [1, m_.shape[1]]).arraySync().flat(),
                 y:    m_.slice([1,0], [1, m_.shape[1]]).arraySync().flat(),
                 z:    m_.slice([2,0], [1, m_.shape[1]]).arraySync().flat(),

                 type: 'scatter3d',
                 mode: 'lines',
                 legendgroup: 'Catenarys',
                 showlegend:(index==0)?true:false,
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

function getCatenaryIndex(){

    var graphDiv = document.getElementById(plotID);

        graphDiv.data.forEach((trace, index)=>{

            if(trace.name=='catenary'){

                catenaryTracesIndex.push(index)
            };
        });
};