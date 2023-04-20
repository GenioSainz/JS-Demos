
var sun;
var planets = [];
var sunOptions    = {mass:10e3, drawPath:false,drawParticle:true,radius:25,color:[255,255,0]};
var planetOptions = {mass:1,    drawPath:true, drawParticle:true,arrowLen:50,radius:10,pathPoints:500,color:[0,0,255]};

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
 
  sun     = new ParticleMass( {x:windowWidth/2,      y:windowHeight/2}, {v_m:0,v_d:0},  {a_m:0,a_d:0}, sunOptions) ;

  planets.push( new ParticleMass( {x:windowWidth/2 + 400,y:windowHeight/2},  {v_m:3,v_d:-90},{a_m:0,a_d:0}, planetOptions))
  planets.push( new ParticleMass( {x:windowWidth/2 - 450,y:windowHeight/2},  {v_m:3,v_d:-90},{a_m:0,a_d:0}, planetOptions))
  planets.push( new ParticleMass( {x:windowWidth/2 ,y:windowHeight/2 + 350}, {v_m:3,v_d:0}  ,{a_m:0,a_d:0}, planetOptions))
  planets.push( new ParticleMass( {x:windowWidth/2 ,y:windowHeight/2 - 400}, {v_m:3,v_d:180},{a_m:0,a_d:0}, planetOptions))


}

function draw() {
  
    background(240);strokeWeight(2);noFill()
    
    myUtils.drawGrid();fill(180)
    
    // draw suns
    sun.draw()
    
    // draw planets
    planets.forEach(planet => {
      planet.gravityTo(sun);
      planet.draw();
    });


  };

function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}

