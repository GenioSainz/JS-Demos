
var dxy         = 15;
var P           = [];

var cellSize   = 200;
var axisLength = cellSize/2;
var nx = 2;
var ny = 2;
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
let gradientBR = new p5.Vector(+1,-1); // bottomRight
let gradientTL = new p5.Vector(-1,+1); // topLeft
let gradientTR = new p5.Vector(-1,-1); // topRight

let cornerBL = {}; // bottomLeft
let cornerBR = {}; // bottomRight
let cornerTL = {}; // topLeft
let cornerTR = {}; // topRight

var plotX; var idx = 'plotX';
var plotY; var idy = 'plotY';

function setup() {

    createCanvas(windowWidth,windowHeight, WEBGL);
    angleMode(DEGREES);strokeWeight(5);

    frameRate(5);

    myFont = loadFont('font.otf');
    textFont(myFont);
    textSize(16);
    textAlign(CENTER,CENTER);

    // gui = createGui('Rotation Axis');
    // gui.addGlobals('rX','rY','rZ','tZ');
    
    generatePermutation();

   
    plotX = createDiv('').id(idx);
    plotY = createDiv('').id(idy);
    plotX.position(25, 25);
    plotY.position(225, 25);
    plotX.style('border','2px solid');
    plotY.style('border','2px solid');



    
};

function draw(){

    background(200);orbitControl(10,10);
    strokeWeight(2)

    // Rotations X,Y,Z
    ////////////////////

    rotateX(rX,);rotateY(rY);rotateZ(rZ);

    translate(0,0,tZ)
     
    //  (0,0) = (windowWidth/2, windowHeight/2)
    /////////////////////////////////////////////
    var x = mouseX-windowWidth/2;
    var y = mouseY-windowHeight/2;
   
    // -nx:1:nx   -ny:1:ny
    //////////////////////////
    var xGrid = x/cellSize;
    var yGrid = y/cellSize;
    
    //fadeInterpolation(xGrid)
    smoothInterp(idx,xGrid,'X')
    smoothInterp(idy,yGrid,'Y')

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

        // Index for indexing permutation table
        ////////////////////////////////////////
        var indexX = cornerBL.x + nx;
        var indexY = cornerBL.y + ny;

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

        // Draw Projections
        /////////////////////////////////////////////////////
        drawProjections(x,y,cornerBL,0,0,vectorBL,temGradBL,'a',[255,0,0])
        drawProjections(x,y,cornerBL,1,0,vectorBR,temGradBR,'b',[0,255,0])
        drawProjections(x,y,cornerBL,0,1,vectorTL,temGradTL,'c',[0,0,255])
        drawProjections(x,y,cornerBL,1,1,vectorTR,temGradTR,'d',[255,0,255])
        

        // Draw Inputs vectors
        ///////////////////
        push()
            strokeWeight(2)
            myUtils.drawArrow([cornerBL.x*cellSize,cornerBL.y*cellSize],[x,y], {color:[255,0,0]  , arrowHead:0.05}); // bottomLeft
            myUtils.drawArrow([cornerBR.x*cellSize,cornerBR.y*cellSize],[x,y], {color:[0,255,0]  , arrowHead:0.05}); // bottomRight
            myUtils.drawArrow([cornerTL.x*cellSize,cornerTL.y*cellSize],[x,y], {color:[0,0,255]  , arrowHead:0.05}); // topLeft
            myUtils.drawArrow([cornerTR.x*cellSize,cornerTR.y*cellSize],[x,y], {color:[255,0,255], arrowHead:0.05}); // topRight
        pop()
        
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

function generatePermutation(){

  for(let i = 0; i < 256; i++) {
	     P[i] = i;
  };

  shuffleArray(P);

};

function shuffleArray(arrayToShuffle) {
	for(let e = arrayToShuffle.length-1; e > 0; e--) {
		const index = Math.round(Math.random()*(e-1));
		const temp = arrayToShuffle[e];
		
		arrayToShuffle[e] = arrayToShuffle[index];
		arrayToShuffle[index] = temp;
	}
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
	strokeWeight(1)
    for(let X=-nx;X<nx;X++){
        for(let Y=-ny;Y<ny;Y++){
                 
                var indexX = X + nx;
                var indexY = Y + ny;
                
                var indexBL = P[ P[indexX]   + indexY   ];
                var indexBR = P[ P[indexX+1] + indexY   ];
                var indexTL = P[ P[indexX]   + indexY+1 ];
                var indexTR = P[ P[indexX+1] + indexY+1 ];
                
                
                var X1 = X*cellSize;
                var Y1 = Y*cellSize  + cellSize;
                var Gr = getGradient( indexTL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.04}); 


                var X1 = X*cellSize + cellSize;
                var Y1 = Y*cellSize + cellSize;
                var Gr = getGradient( indexTR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.04}); 

                var X1 = X*cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.04}); 

                var X1 = X*cellSize+cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.04}); 
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
        return gradientTR

    }else{
        return gradientTL
    };

};

function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
};

function smoothInterp(id,gridValue,txt){
    

    var minValue = floor(gridValue);

    // normalize values => scalar
    var tn = gridValue-floor(gridValue)
    var sn = 6*tn**5-15*tn**4+10*tn**3

    // normalize values =>array
    var t = myUtils.linspace(0,1,25);
    var s = t.map(t => 6*t**5-15*t**4+10*t**3);

    var traceInterpolation = {
        x: [0,tn,tn],
        y: [sn,sn,0],
        mode: 'lines+markers',
        line:  {color: 'rgb(0,0,0)',width: 0.5},
        marker:{color: 'rgb(127,127,127)',size: 8},
    };

    var traceFunction = {
        x: t,
        y: s,
        mode: 'lines',
        line:  {color: 'rgb(255,0,0)',width: 2}
    };


    var data = [traceInterpolation,traceFunction];


    var anotation = [  
                        // OUTPUT
                        {
                        x: 0.15,
                        y: sn +0.15,
                        xref: 'x',
                        yref: 'y',
                        text: `${(sn+minValue).toFixed(3)}`,
                        showarrow: false,
                        },

                        // INPUT
                        {
                        x: tn +0.15,
                        y: 0.15,
                        xref: 'x',
                        yref: 'y',
                        text: `${(tn+minValue).toFixed(3)}`,
                        showarrow: false,
                        }
                    ];


    var layout = {
        title: {text:`<b>Interpolate ${txt} Grid`,font:{size:14}},
        showlegend: false,
        width:  200,
        height: 200,
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
            pad: 4
          },

          xaxis: {
                    range: [0,1.1],
                    tickvals:[0,1],
                    ticktext:[`${floor(gridValue)}`, `${ceil(gridValue)}`],
             },
          yaxis: {
                    range: [0,1.1],
                    tickvals:[0,1],
                    ticktext:[`${floor(gridValue)}`, `${ceil(gridValue)}`],
             },

         annotations:anotation
        
      }

    var config = {   
                    responsive: true,
                    displayModeBar: false}
      
      Plotly.newPlot(id, data,layout,config)



}
