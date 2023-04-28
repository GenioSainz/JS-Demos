
var sun;
var planets = [];
var sunOptions    = {mass:10e3, drawPath:false,drawArrow:false,radius:25,color:[255,255,0]};
var planetOptions = {mass:1,vfriction:1,drawPath:true,pathPoints:500,arrowLen:50,radius:10,color:[0,255,0],pathColor:[0,0,0]};

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
 
  sun     = new Particle( {x:windowWidth/2,      y:windowHeight/2}, {v_m:0,v_d:0},  {a_m:0,a_d:0}, sunOptions) ;

  planets.push( new Particle( {x:windowWidth/2 + 400,y:windowHeight/2},  {v_m:3,v_d:-90},{g:0}, planetOptions))
  planets.push( new Particle( {x:windowWidth/2 - 450,y:windowHeight/2},  {v_m:3,v_d:-90},{g:0}, planetOptions))
  planets.push( new Particle( {x:windowWidth/2 ,y:windowHeight/2 + 350}, {v_m:3,v_d:0}  ,{g:0}, planetOptions))
  planets.push( new Particle( {x:windowWidth/2 ,y:windowHeight/2 - 400}, {v_m:3,v_d:180},{g:0}, planetOptions))


}

function draw() {
  
    background(240);strokeWeight(2);noFill()
    
    myUtils.drawGrid();fill(180)
    
    // draw suns
    sun.draw()
    
    // draw planets
    planets.forEach(planet => {

      planet.applyForces([ planet.gravityTo(sun)]);
      planet.update();
      planet.draw();
      
    });


  };

function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}

