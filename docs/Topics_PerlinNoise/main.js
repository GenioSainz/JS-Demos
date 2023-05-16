

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

        t+=0.01

       };

}


function windowResized(){
  
    resizeCanvas(windowWidth, windowHeight);
};

