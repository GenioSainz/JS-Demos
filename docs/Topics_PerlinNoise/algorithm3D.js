
var dxy         = 15;
var P           = [];

var cellSize   = 50;
var axisLength = cellSize/2;
var nx         = 2;
var ny         = 2;
var myFont;
var gui;


var gradientArray
var angelStep = 10;

var rXStep = angelStep;
var rXMin  = -180;
var rXMax  =  180;
var rX     = 0;

var rYStep = angelStep;
var rYMin  = -180;
var rYMax  =  180;
var rY     = 0;

var rZStep = angelStep;
var rZMin  = -180;
var rZMax  =  180;
var rZ     = 0;

var tZStep = 50;
var tZMin  = -1000;
var tZMax  =  1000;
var tZ     = 0;


let vectorBL = new p5.Vector(0,0); // bottomLeft
let vectorBR = new p5.Vector(0,0); // bottomRight
let vectorTL = new p5.Vector(0,0); // topLeft
let vectorTR = new p5.Vector(0,0); // topRight

let gradientBL = new p5.Vector(+1,+1); // bottomLeft
let gradientBR = new p5.Vector(-1,+1); // bottomRight
let gradientTL = new p5.Vector(+1,-1); // topLeft
let gradientTR = new p5.Vector(-1,-1); // topRight

let cornerBL = {}; // bottomLeft
let cornerBR = {}; // bottomRight
let cornerTL = {}; // topLeft
let cornerTR = {}; // topRight

let valueA = 0;
let valueB = 0;
let valueC = 0;
let valueD = 0;

let U  = 0;
let V  = 0;
let AB = 0;
let CD = 0;
let Z  = 0;


var plotX;  var idx = 'plotX';
var plotY;  var idy = 'plotY';

var plotVals; var idVals = 'plotVals'

var plotAB; var idAB = 'plotAB';
var plotCD; var idCD = 'plotCD';
var plotZ;  var idZ  = 'plotZ';

var txtX = ['X','U'];
var txtY = ['Y','V'];

var divSize = 180;
var divPad  = 10;

let noiseObject = new PerlinNoise();
P = noiseObject.P;

function setup() {

    createCanvas(windowWidth,windowHeight, WEBGL);
    angleMode(DEGREES);strokeWeight(5);

    frameRate(5);

    myFont = loadFont('font.otf');
    textFont(myFont);
    textSize(16);
    textAlign(CENTER,CENTER);

    gui = createGui('Rotation Axis').setPosition(windowWidth-150-divPad,divPad);
    gui.addGlobals('rX','rY','rZ','tZ');

    plotX     = createDiv('').id(idx);
    plotY     = createDiv('').id(idy);
    plotVals  = createDiv('').id(idVals);
    plotAB    = createDiv('').id(idAB);
    plotCD    = createDiv('').id(idCD);
    plotZ     = createDiv('').id(idZ);

    plotX    .position(divPad             , divPad);
    plotY    .position(2*divPad+divSize  , divPad);
    plotVals .position(divPad            , 2*divPad + divSize);

    if(windowWidth>windowHeight){
        plotAB   .position(divPad             , 3*divPad + 2*divSize);
        plotCD   .position(2*divPad+divSize   , 3*divPad + 2*divSize);
        plotZ    .position(2*divPad+divSize/2 , 4*divPad + 3*divSize);
    }else{

        plotAB   .position(3*divPad+2*divSize , divPad);
        plotCD   .position(4*divPad+3*divSize , divPad);
        plotZ    .position(2*divPad+2.5*divSize , 2*divPad + divSize);
    };
    
    plotX.style('border','2px solid');
    plotY.style('border','2px solid');
    plotVals.style('border','2px solid');
    plotAB.style('border','2px solid');
    plotCD.style('border','2px solid');
    plotZ.style('border','2px solid');

};

function draw(){

    background(200);//orbitControl(10,10);
    strokeWeight(2);

    // Rotations X,Y,Z
    ////////////////////
    rotateX(rX);
    rotateY(rY);
    rotateZ(rZ);

    translate(0,0,tZ)
     
    //  (0,0) = (windowWidth/2, windowHeight/2)
    /////////////////////////////////////////////
    var x = mouseX-windowWidth/2;
    var y = mouseY-windowHeight/2;
   
    // -nx:1:nx   -ny:1:ny
    //////////////////////////
    var xGrid = x/cellSize;
    var yGrid = y/cellSize;

    // Index for indexing permutation table
    ////////////////////////////////////////
    var indexX = Math.floor(xGrid) & 255;
    var indexY = Math.floor(yGrid) & 255;

    drawGrid();
    drawReferentSystem();
    getGradient();
    drawGradient();

    // If mouse is over grid
    ///////////////////////////
    var boolX = xGrid>=-nx && xGrid<=nx;
    var boolY = yGrid>=-ny && yGrid<=ny;

    if(boolX && boolY){
        
        // actual cell corners
        ///////////////////////
        cornerBL = {x:floor(xGrid), y:floor(yGrid)};
        cornerBR = {x:ceil(xGrid) , y:floor(yGrid)};
        cornerTL = {x:floor(xGrid), y:ceil(yGrid)};
        cornerTR = {x:ceil(xGrid) , y:ceil(yGrid)};

        // actual vectors from corners to input (x,y)
        ///////////////////////////////////////////////
        vectorBL.set(xGrid-cornerBL.x, yGrid-cornerBL.y);  
        vectorBR.set(xGrid-cornerBR.x, yGrid-cornerBR.y);  
        vectorTL.set(xGrid-cornerTL.x, yGrid-cornerTL.y); 
        vectorTR.set(xGrid-cornerTR.x, yGrid-cornerTR.y);  

        var indexBL = P[ P[indexX]   + indexY   ];
        var indexBR = P[ P[indexX+1] + indexY   ];
        var indexTL = P[ P[indexX]   + indexY+1 ];
        var indexTR = P[ P[indexX+1] + indexY+1 ];

        // Cell Gradients
        ///////////////////
        var temGradBL = getGradient( indexBL );
        var temGradBR = getGradient( indexBR );
        var temGradTL = getGradient( indexTL );
        var temGradTR = getGradient( indexTR );

        valueA = vectorBL.dot(temGradBL);
        valueB = vectorBR.dot(temGradBR);
        valueC = vectorTL.dot(temGradTL);
        valueD = vectorTR.dot(temGradTR);

        // Draw Projections
        /////////////////////////////////////////////////////
        drawProjections(x,y,cornerBL,0,0,vectorBL,temGradBL,'A',[255,0,0])
        drawProjections(x,y,cornerBL,1,0,vectorBR,temGradBR,'B',[0,255,0])
        drawProjections(x,y,cornerBL,0,1,vectorTL,temGradTL,'C',[0,0,255])
        drawProjections(x,y,cornerBL,1,1,vectorTR,temGradTR,'D',[255,0,255])
        
        // Draw Inputs vectors
        ///////////////////
        push()
            strokeWeight(2)
            myUtils.drawArrow([cornerBL.x*cellSize,cornerBL.y*cellSize],[x,y], {color:[255,0,0]  , arrowHead:0.05}); // bottomLeft
            myUtils.drawArrow([cornerBR.x*cellSize,cornerBR.y*cellSize],[x,y], {color:[0,255,0]  , arrowHead:0.05}); // bottomRight
            myUtils.drawArrow([cornerTL.x*cellSize,cornerTL.y*cellSize],[x,y], {color:[0,0,255]  , arrowHead:0.05}); // topLeft
            myUtils.drawArrow([cornerTR.x*cellSize,cornerTR.y*cellSize],[x,y], {color:[255,0,255], arrowHead:0.05}); // topRight
        pop()

        // Plot Interpolations
        ///////////////////
        U = smoothInterp(idx,xGrid,txtX)
        V = smoothInterp(idy,yGrid,txtY)
        plotValues()

        AB = lerpInterp(idAB,U,valueA,valueB,['<b>A','<b>B'],1);
        CD = lerpInterp(idCD,U,valueC,valueD,['<b>C','<b>D'],2);
        Z  = lerpInterp(idZ,V,AB,CD ,['<b>AB','<b>CD'],3);
        
        
        console.log('-------')
        console.table({xGrid,yGrid,indexX,indexY,temGradBL,temGradBR,temGradTL,temGradTR})

        // console.table class values vs scrpt values
        // _ class values 
        // var Z_ = noiseObject.eval(xGrid,yGrid).toFixed(4);
        // var U_ = noiseObject.U.toFixed(4);
        // var V_ = noiseObject.V.toFixed(4)
        // var A_ = noiseObject.valueA.toFixed(4);
        // var B_ = noiseObject.valueB.toFixed(4);
        // var C_ = noiseObject.valueC.toFixed(4);
        // var D_ = noiseObject.valueD.toFixed(4);
        // var AB_ = noiseObject.valueAB.toFixed(4);
        // var CD_ = noiseObject.valueCD.toFixed(4);

        // var sep1 = '----------------------';
        // var sep2 = '----------------------';
        // var sep3 = '----------------------';
        // console.table( {U_,V_,sep1,A_,B_,C_,D_,sep2,AB_,CD_,Z_,sep3,AB,CD,Z} )

        //console.log({Z})


    }else{

        // Plot Interpolations
        ///////////////////

        xGrid = 0;
        yGrid = 0;
        U = smoothInterp(idx,xGrid,txtX);
        V = smoothInterp(idy,yGrid,txtY);
        plotValues();

        AB = lerpInterp(idAB,U,valueA,valueB,['<b>A','<b>B'],1);
        CD = lerpInterp(idCD,U,valueC,valueD,['<b>C','<b>D'],2);
        Z  = lerpInterp(idZ,V,AB,CD ,['<b>AB','<b>CD'],3);
    };
};

function drawGrid(){

    for(let x=-nx;x<nx;x++){
         for(let y=-ny;y<ny;y++){
            
            var xc = x*cellSize;
            var yc = y*cellSize;
            noFill();strokeWeight(0.5)
            rect(xc,yc,cellSize);
        };
    };

    for(let i=-nx;i<=nx;i++){

        fill(0)
        text(`${i}`,i*cellSize,nx*cellSize+dxy);
        text(`${i}`,-nx*cellSize-dxy,i*cellSize);
    };
};

function drawReferentSystem(){

    push()
    
        strokeWeight(3);stroke(0)

        line(-axisLength,0,0, axisLength,0,0);
        line(0,-axisLength,0, 0,axisLength,0);
        line(0,0,-axisLength, 0,0,axisLength);

        stroke(0)
        text('+X',axisLength+dxy,dxy);
        text('+y',dxy,axisLength+dxy);

        translate(0,0,axisLength)
        text('+Z',dxy,-dxy);

    pop();

};


function drawProjections(x,y,corner,dx,dy,cornerVec,gradientVec,txt,color){

    var X1           = corner.x*cellSize + dx*cellSize;
    var Y1           = corner.y*cellSize + dy*cellSize;   
    var a            = cornerVec.copy().mult(cellSize);
    var b            = gradientVec.copy().mult(cellSize);
    var num          = a.dot(b);
    var dem          = b.dot(b);
    var proyection   = b.mult(num/dem);
    var X2           = X1 + proyection.x
    var Y2           = Y1 + proyection.y

    push()
        strokeWeight(0.5);stroke(0); line(x,y,X2,Y2);
        strokeWeight(1);stroke(color);line(X1,Y1,X2,Y2);
        line(X1,Y1,0,X1,Y1,num/cellSize);
        translate(X1,Y1,num/cellSize)
        fill(color);text(txt,dxy,dxy);
    pop();
};

function drawGradient(){

	strokeWeight(3);
    var module    = Math.sqrt(2)*cellSize/2.5;
    var arrowHead = 0.1;
    var color     = [255,255,255];

    for(let X=-nx;X<nx;X++){
        for(let Y=-ny;Y<ny;Y++){
                
                var indexX = X & 255;
                var indexY = Y & 255;
                
                var indexBL = P[ P[indexX]   + indexY   ];
                var indexBR = P[ P[indexX+1] + indexY   ];
                var indexTL = P[ P[indexX]   + indexY+1 ];
                var indexTR = P[ P[indexX+1] + indexY+1 ];
                
                var X1 = X*cellSize;
                var Y1 = Y*cellSize  + cellSize;
                var Gr = getGradient( indexTL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 

                var X1 = X*cellSize + cellSize;
                var Y1 = Y*cellSize + cellSize;
                var Gr = getGradient( indexTR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 

                var X1 = X*cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 

                var X1 = X*cellSize+cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 
        };
    };

};

function getGradient(index){

    var  k = index % 4;

    if( k == 0){
        return gradientBL

    }else if( k == 1){
        return gradientBR

    }else if( k == 2){
        return gradientTL

    }else{
        return gradientTR
    };

};

function plotValues(){

        var traceA= {
            x: [`<b>A<br>${(valueA).toFixed(4)}`],
            y: [valueA],
            type: 'bar',
            marker:{color: 'rgb(255,0,0)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var traceB= {
            x: [`<b>B<br>${(valueB).toFixed(4)}`],
            y: [valueB],
            type: 'bar',
            marker:{color: 'rgb(0,255,0)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var traceC= {
            x: [`<b>C<br>${(valueC).toFixed(4)}`],
            y: [valueC],
            type: 'bar',
            marker:{color: 'rgb(0,0,255)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var traceD= {
            x: [`<b>D<br>${(valueD).toFixed(4)}`],
            y: [valueD],
            type: 'bar',
            marker:{color: 'rgb(255,0,255)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var data = [traceA,traceB,traceC,traceD];
    
        var layout = {
            title: {text:`<b>Corners Values`,font:{size:13}},
            showlegend: false,
            width:  2*divSize +divPad,
            height: divSize,
            margin: {
                l: 80,
                r: 80,
                b: 40,
                t: 40,
                pad: 4
              },
    
              yaxis: {
                        range: [-1.1,1.1],
                        tickvals:[-1,0,1],
                 },     
          }
    
        var config = {   
                        responsive: true,
                        displayModeBar: false}
          
        Plotly.newPlot(idVals, data,layout,config);
    
}

function smoothInterp(id,gridValue,txt){

    // normalize values => scalar
    var tn = gridValue-floor(gridValue);
    var sn = 6*tn**5-15*tn**4+10*tn**3

    // normalize values =>array
    var t = myUtils.linspace(0,1,25);
    var s = t.map(t => 6*t**5-15*t**4+10*t**3);

    var traceInterpolation = {
        x: [0,tn,tn],
        y: [sn,sn,0],
        mode: 'lines+markers',
        line:  {color: 'rgb(0,0,0)',width: 0.5},
        marker:{color: 'rgb(127,127,127)',size: 6},
    };

    var traceFunction = {
        x: t,
        y: s,
        mode: 'lines',
        line:  {color: 'rgb(255,0,0)',width: 2}
    };


    var data = [traceInterpolation,traceFunction];

    var dxy = 0.15;

    var anotation = [  
                        // OUTPUT
                        {
                        x: dxy,
                        y: sn + dxy,
                        xref: 'x',
                        yref: 'y',
                        text: `${(sn).toFixed(4)}`,
                        showarrow: false,
                        },

                        // INPUT
                        {
                        x: tn + dxy,
                        y: dxy,
                        xref: 'x',
                        yref: 'y',
                        text: `${(tn).toFixed(4)}`,
                        showarrow: false,
                        }
                    ];


    var layout = {
        title: {text:`<b>Interpolate ${txt[0]}grid ${tn.toFixed(4)} <br> ${txt[1]}: ${sn.toFixed(4)} `,font:{size:13}},
        showlegend: false,
        width:  divSize,
        height: divSize,
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
            pad: 4
          },

          xaxis: {
                    range: [0,1.2],
                    tickvals:[0,1],
                    //ticktext:[`${floor(gridValue)}`, `${ceil(gridValue)}`],
             },
          yaxis: {
                    range: [0,1.2],
                    tickvals:[0,1],
                    //ticktext:[`${floor(gridValue)}`, `${ceil(gridValue)}`],
             },

         annotations:anotation
        
      }

    var config = {   
                    responsive: true,
                    displayModeBar: false}
      
    Plotly.newPlot(id, data,layout,config);

    return sn

};

function lerpInterp(id,tn,min,max,txt,k){

     
    if(min<max){

        var MIN = min;
        var MAX = max;

        var lerpTxt = '';
        
    }else{
         
        var MIN = max;
        var MAX = min;
        txt.reverse();

        tn = 1-tn;
        var lerpTxt = '1-';
    }

    if(k==1){

        var txtTitle = 'Interpolate AB '
        var uv = `${lerpTxt}U`;

    }else if(k==2){

        var txtTitle = 'Interpolate CD '
        var uv = `${lerpTxt}U`;

    }else if(k==3){

        var txtTitle = 'noise2D(Xgrid,Ygrid) '
        var uv = `${lerpTxt}V`;

    };

    var interp = (MAX-MIN)*tn + MIN;

    var traceInterpolation = {
        x: [0,tn,tn],
        y: [interp,interp,0],
        mode: 'lines+markers',
        line:  {color: 'rgb(0,0,0)',width: 0.5},
        marker:{color: 'rgb(127,127,127)',size: 6},
    };

    var traceFunction = {
        x: [0,1],
        y: [MIN,MAX],
        mode: 'lines',
        line:  {color: 'rgb(255,0,0)',width: 2}
    };

    var data = [traceInterpolation,traceFunction];

    var anotation = [  
                        // INPUT
                        {
                        x: tn+0.02,
                        y: 0,
                        xref: 'x',
                        yref: 'y',
                        text: `<b>${uv}`,
                        showarrow: true,
                        arrowhead: 2,
                        ax: 20,
                        ay: -20
                        },
                    ];

    var layout = {
        title: {text:`<b>${txtTitle}: ${interp.toFixed(4)} `,font:{size:12}},
        showlegend: false,
        width:  divSize,
        height: divSize,
        margin: {
            l: 25,
            r: 25,
            b: 30,
            t: 30,
            pad: 2
          },

          xaxis: {
                    range: [0,1.1],
                    tickvals:[0,1],
             },
          yaxis: {
                    //range:   [MIN*0.5,MAX*1.5],
                    tickvals:[MIN,MAX],
                    ticktext:txt,
             },

         annotations:anotation
        
      };

    var config = {   
                    responsive: true,
                    displayModeBar: false}
      
      Plotly.newPlot(id, data,layout,config)

      return interp

};

function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};

function lerpInterpolation(tn,a,b){
         
    return (b-a)*tn + a;
};

function smoothInterpolation(tn){
 
    return 6*tn**5 - 15*tn**4 + 10*tn**3
};




