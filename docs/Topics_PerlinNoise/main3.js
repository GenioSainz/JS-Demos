
var axisLength  = 100;
var dxy         = 10;
var P           = [];

var cellSize = 150;
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

    myFont = loadFont('font.otf');
    textFont(myFont);
    textSize(16);
    textAlign(CENTER,CENTER);

    gui = createGui('Rotation Axis');
    gui.addGlobals('rX','rY','rZ');
    
    generatePermutation()
    
};

function draw() {

    background(255);orbitControl(5,5);
    strokeWeight(2)

    // Rotations X,Y,Z
    ////////////////////

    rotateX(rX,);rotateY(rY);rotateZ(rZ);
     
    //  (0,0) = (windowWidth/2, windowHeight/2)
    /////////////////////////////////////////////
    var x = mouseX-windowWidth/2;
    var y = mouseY-windowHeight/2;
   
    // -nx:1:nx   -ny:1:ny
    ///////////////////////////////////7
    var xGrid = x/cellSize;
    var yGrid = y/cellSize;

    var boolX = xGrid>=-nx && xGrid<=nx;
    var boolY = yGrid>=-ny && yGrid<=ny;

    if(boolX && boolY){
        
        cornerBL = {x:floor(xGrid), y:ceil(yGrid)};
        cornerBR = {x:ceil(xGrid) , y:ceil(yGrid)};
        cornerTL = {x:floor(xGrid), y:floor(yGrid)};
        cornerTR = {x:ceil(xGrid) , y:floor(yGrid)};

        vectorBL.set(xGrid-cornerBL.x, yGrid-cornerBL.y);  // bottomLeft
        vectorBR.set(xGrid-cornerBR.x, yGrid-cornerBR.y);  // bottomRight
        vectorTL.set(xGrid-cornerTL.x, yGrid-cornerTL.y);  // topLeft
        vectorTR.set(xGrid-cornerTR.x, yGrid-cornerTR.y);  // topRight
         
        push()
            myUtils.drawArrow([cornerBL.x*cellSize,cornerBL.y*cellSize],[x,y], {color:[255,0,0]  , arrowHead:0.05}); // bottomLeft
            myUtils.drawArrow([cornerBR.x*cellSize,cornerBR.y*cellSize],[x,y], {color:[0,255,0]  , arrowHead:0.05}); // bottomRight
            myUtils.drawArrow([cornerTL.x*cellSize,cornerTL.y*cellSize],[x,y], {color:[0,0,255]  , arrowHead:0.05}); // topLeft
            myUtils.drawArrow([cornerTR.x*cellSize,cornerTR.y*cellSize],[x,y], {color:[255,0,255], arrowHead:0.05}); // topRight
        pop()
   
    }

    drawGrid();
    drawReferentSystem();
    getGradient();
    drawGradient();
    

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

    strokeWeight(3)
    // stroke(255,0,0);line(-axisLength,0,0, axisLength,0,0);
    // stroke(0,255,0);line(0,-axisLength,0, 0,axisLength,0);
    // stroke(0,0,255);line(0,0,-axisLength, 0,0,axisLength);
    
    stroke(255,255,0)
    line(-axisLength,0,0, axisLength,0,0);
    line(0,-axisLength,0, 0,axisLength,0);
    line(0,0,-axisLength, 0,0,axisLength);


    stroke(0)
    text('+X',axisLength+dxy,dxy);
    text('+y',dxy,axisLength+dxy);

    translate(0,0,axisLength)
    text('+Z',dxy,-dxy);

    pop()

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
	
    for(let X=-nx;X<=nx;X++){
        for(let Y=-ny;Y<=ny;Y++){

                indexBL = P[ P[X]   + Y   ];
                indexBR = P[ P[X+1] + Y+1 ];
                indexTL = P[ P[X]   + Y+1 ];
                indexTR = P[ P[X+1] + Y+1 ];

                
                var X1 = X*cellSize;
                var Y1 = Y*cellSize;
                
                gradientArray = [ getGradient( indexBL ), getGradient( indexBR ), getGradient( indexTL ), getGradient( indexTR )];
 
                gradientArray.forEach((vector)=>{

                    var X2 = X1 + vector.x*cellSize
                    var Y2 = Y1 + vector.y*cellSize
    
                    myUtils.drawArrow([X1,Y1],[X2,Y2], {color:[0,0,0], arrowHead:0.05}); 


                });

        };
    };

};

function getGradient(index){

    var  k = index & 3;

    if( k == 0){
        return gradientBL

    }else if( k == 1){
        return gradientBR

    }else if( k == 2){
        return gradientTR

    }else{
        return gradientTL
    };

}

function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
};