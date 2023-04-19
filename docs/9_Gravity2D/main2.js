
var sun;
var planet;
var sunOptions    = {mass:10e3, drawPath:false,drawParticle:true,radiusCircle:20,color:[255,255,0]};
var planetOptions = {mass:1,    drawPath:true, drawParticle:true,arrowLen:50,radiusCircle:10,color:[0,0,255]};
var Planets = [];
var Nplanets = 50;
function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER)
 
  sun    = new ParticleMass( {x:windowWidth/2,      y:windowHeight/2}, {v_m:0,v_d:0},  {a_m:0,a_d:0}, sunOptions) ;
  //planet = new ParticleMass( {x:windowWidth/2 + 500,y:windowHeight/2}, {v_m:2,v_d:-90},{a_m:0,a_d:0}, planetOptions) ;

  for(let i=0;i<Nplanets;i++){

       Planets.push(  new ParticleMass( {x:random(windowWidth),y:random(windowHeight)}, {v_m:random(0,3),v_d:random(360)},{a_m:0,a_d:0}, planetOptions) )
  }
}

function draw() {
  
    background(240);strokeWeight(2);noFill()
    
    myUtils.drawGrid();fill(180)
    
    // draw suns
    sun.draw()
    
    // planet.gravityTo(sun);
    // planet.draw();

    for(let i=0;i<Nplanets;i++){
         Planets[i].gravityTo(sun);
         Planets[i].draw();
    };

  };

function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}

