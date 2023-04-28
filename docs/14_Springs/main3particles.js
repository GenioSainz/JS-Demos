

var fr              = 3;
let particleOptions = {kd:0.01,
                       k:0.01,c:0.5,
                       radius:20,arrowLen:40,
                       drawPath:false,drawArrow:true,pathColor:[255,0,0],pathPoints:100}
var particleA;
var particleB;
var separation = 300;
var springX;
var springY;
var gridCellSize = 50;

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  frameRate(fr);

  var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,windowWidth/2,windowHeight/2);
  springX = xGrid;
  springY = yGrid;

  var dxy  = 200;
  var xposA = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
  var yposA = random(windowHeight/2-dxy,windowHeight/2+dxy);
  var xposB = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
  var yposB = random(windowHeight/2-dxy,windowHeight/2+dxy);
  var xposC = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
  var yposC = random(windowHeight/2-dxy,windowHeight/2+dxy);
  particleA = new Particle( {x:xposA,y:yposA} ,{v_m:0,v_d:90}, {g:0}, particleOptions);
  particleB = new Particle( {x:xposB,y:yposB} ,{v_m:0,v_d:90}, {g:0}, particleOptions);
  particleC = new Particle( {x:xposC,y:yposC} ,{v_m:0,v_d:90}, {g:0}, particleOptions);

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
     
    var springAB = Particle.spring(particleA,particleB,separation);
    var springBC = Particle.spring(particleB,particleC,separation);
    var springCA = Particle.spring(particleC,particleA,separation);
    

  
    particleA.applyForces([ particleA.gravity, particleA.dragForce(), springAB.mult(-1), springCA.mult(1) ]);
    particleA.checkEdgesBounceCentroid();particleA.update();particleA.draw();

    particleB.applyForces([ particleB.gravity, particleB.dragForce(), springAB.mult(-1), springBC.mult(-1)]);
    particleB.checkEdgesBounceCentroid();particleB.update();particleB.draw();

    particleC.applyForces([ particleC.gravity, particleB.dragForce(),springBC.mult(-1),springCA.mult(-1)]);
    particleC.checkEdgesBounceCentroid();particleC.update();particleC.draw();

   
    push();stroke(0);strokeWeight(0.5);text(CENTER,CENTER)
    line(particleA.pos.x,particleA.pos.y,particleB.pos.x,particleB.pos.y);fill(0);text('A',particleA.pos.x,particleA.pos.y)
    line(particleA.pos.x,particleA.pos.y,particleC.pos.x,particleC.pos.y);fill(0);text('B',particleB.pos.x,particleB.pos.y)
    line(particleB.pos.x,particleB.pos.y,particleC.pos.x,particleC.pos.y);fill(0);text('C',particleC.pos.x,particleC.pos.y)
    pop();
    




};


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

  var {xCenter,yCenter} = myUtils.roundGrid(gridCellSize);
  springX = xCenter;
  springY = yCenter;

};

