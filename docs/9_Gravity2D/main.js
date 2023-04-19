
var sun;
var planet1;
var planet2;
var sunOptions    = {mass:10e3, drawPath:false,drawParticle:true,radiusCircle:20,color:[255,255,0]};
var planetOptions = {mass:1,    drawPath:true, drawParticle:true,arrowLen:50,radiusCircle:10,pathPoints:500,color:[0,0,255]};

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER)
 
  sun     = new ParticleMass( {x:windowWidth/2,      y:windowHeight/2}, {v_m:0,v_d:0},  {a_m:0,a_d:0}, sunOptions) ;
  planet1 = new ParticleMass( {x:windowWidth/2 + 500,y:windowHeight/2}, {v_m:2,v_d:-90},{a_m:0,a_d:0}, planetOptions) ;
  planet2 = new ParticleMass( {x:windowWidth/2 - 500,y:windowHeight/2}, {v_m:2,v_d:-90},{a_m:0,a_d:0}, planetOptions) ;
}

function draw() {
  
    background(240);strokeWeight(2);noFill()
    
    myUtils.drawGrid();fill(180)
    
    // draw suns
    sun.draw()
    
    planet1.gravityTo(sun);
    planet1.draw();

    planet2.gravityTo(sun);
    planet2.draw();

  };

function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}

