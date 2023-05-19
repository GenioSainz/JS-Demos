
var dxy         = 10;
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


function setup() {

    createCanvas(windowWidth,windowHeight, WEBGL);
    angleMode(DEGREES);strokeWeight(5);

    frameRate(5);

    myFont = loadFont('font.otf');
    textFont(myFont);
    textSize(16);
    textAlign(CENTER,CENTER);

    gui = createGui('Rotation Axis');
    gui.addGlobals('rX','rY','rZ','tZ');
    
    generatePermutation()
    
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

        // BottomLeft Projection
        ///////////////////////////////////////////////////
        var X1           = cornerBL.x*cellSize;
        var Y1           = cornerBL.y*cellSize;   
        var a            = vectorBL.copy().mult(cellSize);
        var b            = temGradBL.copy().mult(cellSize);
        var num          = a.dot(b);
        var dem          = b.dot(b);
        var proyection   = b.mult(num/dem);
        var X2           = X1 + proyection.x
        var Y2           = Y1 + proyection.y
        push()
            strokeWeight(0.5);stroke(0);line(x,y,X2,Y2);
            strokeWeight(2);stroke(255,0,0);line(X1,Y1,X2,Y2);
            line(X1,Y1,0,X1,Y1,num/cellSize);
            translate(X1,Y1,num/cellSize)
            text('a',dxy,dxy);
        pop();
        
        // BottomRight Projection
        ///////////////////////////////////////////////////
        var X1           = cornerBL.x*cellSize + cellSize;
        var Y1           = cornerBL.y*cellSize;
        var a            = vectorBR.copy().mult(cellSize);
        var b            = temGradBR.copy().mult(cellSize);
        var num          = a.dot(b);
        var dem          = b.dot(b);
        var proyection   = b.mult(num/dem);
        var X2           = X1 + proyection.x
        var Y2           = Y1 + proyection.y

        push()
            strokeWeight(0.5);stroke(0);
            strokeWeight(2);stroke(0,255,0);line(X1,Y1,X2,Y2);
            line(X1,Y1,0,X1,Y1,num/cellSize);
            translate(X1,Y1,num/cellSize)
            text('b',dxy,dxy);
        pop();

        // TopLeft Projection
        ///////////////////////////////////////////////////
        var X1           = cornerBL.x*cellSize;
        var Y1           = cornerBL.y*cellSize + cellSize;
        var a            = vectorTL.copy().mult(cellSize);
        var b            = temGradTL.copy().mult(cellSize);
        var num          = a.dot(b);
        var dem          = b.dot(b);
        var proyection   = b.mult(num/dem);
        var X2           = X1 + proyection.x
        var Y2           = Y1 + proyection.y
        push()
            strokeWeight(0.5);stroke(0);line(x,y,X2,Y2);
            strokeWeight(2);stroke(0,0,255);line(X1,Y1,X2,Y2);
            line(X1,Y1,0,X1,Y1,num/cellSize);
            translate(X1,Y1,num/cellSize)
            text('c',dxy,dxy);
        pop();

        // TopRight Projection
        ///////////////////////////////////////////////////
        var X1           = cornerBL.x*cellSize + cellSize;
        var Y1           = cornerBL.y*cellSize + cellSize;
        var a            = vectorTR.copy().mult(cellSize);
        var b            = temGradTR.copy().mult(cellSize);
        var num          = a.dot(b);
        var dem          = b.dot(b);
        var proyection   = b.mult(num/dem);
        var X2           = X1 + proyection.x
        var Y2           = Y1 + proyection.y
        push()
            strokeWeight(0.5);stroke(0);line(x,y,X2,Y2);
            strokeWeight(2);stroke(255,0,255);line(X1,Y1,X2,Y2);
            line(X1,Y1,0,X1,Y1,num/cellSize);
            translate(X1,Y1,num/cellSize)
            text('d',dxy,dxy);
        pop();


        // Inputs vectors
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
        text(`${i}`,i*cellSize+dxy,dxy);
        text(`${i}`,dxy,i*cellSize+dxy);
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
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.05}); 


                var X1 = X*cellSize + cellSize;
                var Y1 = Y*cellSize + cellSize;
                var Gr = getGradient( indexTR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.05}); 

                var X1 = X*cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.05}); 

                var X1 = X*cellSize+cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[255,255,0], arrowHead:0.05}); 
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


