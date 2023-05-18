

var noiseArray = [];
var t          =  0;

function setup() {
    
    frameRate(1)
    createCanvas(windowWidth, windowHeight);
    calcNoise();
};

function draw() {
  
  background(255);strokeWeight(1);
  myUtils.drawGrid({cellSize:50});
  
  //calcNoise();
  drawNoise();
  
};

function drawNoise(){

    noFill();
    beginShape();

    noiseArray.forEach( point => {

        vertex(point.x,point.y);
    });

    endShape()

}

function calcNoise(){

 
       noiseArray = []

       for(let x=0;x<windowWidth;x+=10){

        var y = noise(t)*windowHeight;
        
        noiseArray.push({x,y})

        t+=0.02

       };

}


function windowResized(){
  
    resizeCanvas(windowWidth, windowHeight);
};

var x = 1.6;
var y = 1.4;

var  X = Math.floor(x) & 255;	// Used later
var  Y = Math.floor(y) & 255;	// Used later
var  xf = x-Math.floor(x);
var  yf = y-Math.floor(y);
var  topRight    = new p5.Vector(xf-1.0, yf-1.0);
var  topLeft     = new p5.Vector(xf, yf-1.0);
var  bottomRight = new p5.Vector(xf-1.0, yf);
var  bottomLeft  = new p5.Vector(xf, yf);

console.log({xf,yf,topRight,topLeft,bottomRight, bottomLeft})

topRight    = [ xf-1.0, yf-1.0];
topLeft     = [ xf, yf-1.0];
bottomRight = [ xf-1.0, yf];
bottomLeft  = [ xf, yf];

valueTopRight    = permutation( permutation( X+1) + Y+1);
valueTopLeft     = permutation( permutation( X  ) + Y+1);
valueBottomRight = permutation( permutation( X+1) + Y  );
valueBottomLeft  = permutation( permutation( X  ) + Y  );

dotTopRight    = dot( topRight   , GetConstantVector(valueTopRight));
dotTopLeft     = dot( topLeft    , GetConstantVector(valueTopLeft));
dotBottomRight = dot( bottomRight, GetConstantVector(valueBottomRight));
dotBottomLeft  = dot( bottomLeft , GetConstantVector(valueBottomLeft));