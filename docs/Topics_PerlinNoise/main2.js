
var noiseObject = new PerlinNoise();

var noiseArray  = [];


function setup() {

    createCanvas(windowWidth,windowHeight);
    angleMode(DEGREES);strokeWeight(5);
    frameRate(10);

    for(let i = 0;i<windowWidth;i++){

        noiseArray.push( noiseObject.eval(i*0.003,3.2) )
    }
};

function draw(){

    background(200);
    strokeWeight(2)
    
    noFill()
    beginShape();

    for(let i = 0;i<windowWidth;i++){

        var x = i;
        var y = noiseArray[i];
            y = map(y,-1,1,0,windowHeight)
        vertex(x,y);
    }
  

    endShape()

    
};