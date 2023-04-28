
var nplanets      = 100;
var planets       = [];
var planetOptions = {mass:1,     vfriction:1,drawPath:false,drawArrow:true,pathPoints:500,arrowLen:50,radius:5,color:[0,255,255],pathColor:[0,0,0]};
var sunOptions1   = {mass:10000,  drawPath:false,drawArrow:false,radius:20,color:[255,255,0]};
var sunOptions2   = {mass:20000,  drawPath:false,drawArrow:false,radius:30,color:[255,255,0]};
var sun1,sun2;
var emitter
var vMin = 7;
var vMax = 8;
var angleMin = 85;
var angleMax = 95;


function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);

  sun1     = new Particle( {x:300, y:200}, {v_m:0,v_d:0},  {a_m:0,a_d:0}, sunOptions1) ;
  sun2     = new Particle( {x:700, y:700}, {v_m:0,v_d:0},  {a_m:0,a_d:0}, sunOptions2) ;
  
  emitter = {x:100,y:0};

  for(let i =0;i<nplanets;i++){

      planets.push( new Particle( {x:emitter.x, y:emitter.y},  {v_m:random(vMin,vMax),v_d:random(angleMin,angleMax)},{g:0}, planetOptions))

  };


}

function draw() {
  
    background(240);strokeWeight(2);noFill()
    
    myUtils.drawGrid();fill(180)
    
    Particle.particleDetection(sun1)
    Particle.particleDetection(sun2)

    // draw suns
    sun1.draw();sun1.update();
    sun2.draw();sun1.update();

    
    // draw planets
    planets.forEach(planet => {
   
      planet.applyForces([ planet.gravityTo(sun1), planet.gravityTo(sun2)]);
      planet.update();
      planet.draw();
      particleBackToEmitter(planet);
    });


};

function particleBackToEmitter(particle){
   
    var x  = particle.pos.x;
    var y  = particle.pos.y;

    if( x<0 || x>windowWidth || y<0 || y>windowHeight ){

      particle.pos = new p5.Vector(emitter.x,emitter.y);
      particle.vel = new p5.Vector.fromAngle(random(angleMin*PI/180,angleMax*PI/180),random(vMin,vMax));
      
    };
};


function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)
  // emitter = {x:windowWidth/2,y:0};

  // sun1.pos = new p5.Vector(windowWidth/3,windowHeight/2);
  // sun2.pos = new p5.Vector(2*windowWidth/3,windowHeight/2);

}

