

var fr              = 3;
let particleOptions = {kd:0.001,
                       k:0.01,c:0.25,
                       radius:10,arrowLen:40,
                       drawPath:false,drawArrow:true,pathColor:[255,0,0],pathPoints:100}
var particleA;
var particleB;
var separation = 200;
var springX;
var springY;
var gridCellSize = 50;

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  frameRate(fr);

  var {xCenter,yCenter} = myUtils.roundGrid(gridCellSize);
  springX = xCenter;
  springY = yCenter;

  var dxy  = windowHeight/2 -50;
  var xposA = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
  var yposA = random(windowHeight/2-dxy,windowHeight/2+dxy);
  var xposB = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
  var yposB = random(windowHeight/2-dxy,windowHeight/2+dxy);

  particleA = new Particle( {x:500-100,y:500} ,{v_m:10,v_d:90}, {g:0.0}, particleOptions);
  particleB = new Particle( {x:500+100,y:500} ,{v_m:10,v_d:0}, {g:0.0}, particleOptions);

};

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid();
  

  if(mouseIsPressed){
    
    springX = mouseX;
    springY = mouseY;

  };
     
    
    // var drag    = ParticlesArray[i].dragForce();
    // var gravity = ParticlesArray[i].gravity;

    separation        = 50;
    var springVector  = new p5.Vector((particleA.x-particleB.x),(particleA.y-particleB.y));console.log(springVector,springVector.mag())
        springVector.setMag(springVector.mag()-separation);                                console.log(springVector,springVector.mag())
    var springModule  = particleA.k*springVector.mag();                                    console.log(springModule)

    springVector.normalize();                                                              console.log(springVector,springVector.mag())
    springVector.mult( springModule );                                                     console.log(springVector,springVector.mag())
    
    console.log(springVector)

    particleA.applyForces([springVector.mult(-1)]);
    particleA.update();
    particleA.draw();

    particleB.applyForces([springVector.mult(1)]);
    particleB.update();
    particleB.draw();

   
    push();stroke(0);strokeWeight(0.5);
    line(particleA.pos.x,particleA.pos.y,particleB.pos.x,particleB.pos.y);
    pop();
    
    //ParticlesArray[i].checkEdgesBounceRadius();
    //ParticlesArray[i].checkEdgesBounceCentroid()
    //ParticlesArray[i].checkEdgesWrap();


   //noLoop();

}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

  var {xCenter,yCenter} = myUtils.roundGrid(gridCellSize);
  springX = xCenter;
  springY = yCenter;

};

