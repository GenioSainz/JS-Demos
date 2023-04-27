

var fr              = 30;
let nParticles      = 50;
let ParticlesArray  = [];
let particleOptions = {kd:0.001,
                       k:0.01,c:0,
                       radius:10,arrowLen:40,
                       drawPath:false,drawArrow:false,pathColor:[255,0,0],pathPoints:100}

var springX;
var springY;
var gridCellSize = 50;

function setup() {

  createCanvas(windowWidth, windowHeight);
  frameRate(fr);

  var {xCenter,yCenter} = myUtils.roundGrid(gridCellSize);
  springX = xCenter;
  springY = yCenter;
  
  var theta1 = myUtils.linspace(0,2*PI,nParticles );

  var r1     = 400;
  var k      = 0.01
  for(i=0;i<nParticles;i++){
    
       var xpos = windowWidth/2  + r1*cos(theta1[i]);
       var ypos = windowHeight/2 + r1*sin(theta1[i]);

       particleOptions.color = myUtils.randColor();
       particleOptions.k     = k;
       ParticlesArray.push( new Particle( {x:xpos,y:ypos} ,{v_m:0,v_d:0}, {g:0.0}, particleOptions) );

       k+=0.001
  }; 



};

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid();
  
  line(100,50,200,undefined)
  fill(120)

  if(mouseIsPressed){
    
    springX = mouseX;
    springY = mouseY;

  };

  for(let i=0;i<ParticlesArray.length;i++){
     
    
    var drag    = ParticlesArray[i].dragForce();
    var gravity = ParticlesArray[i].gravity;
    var spring  = ParticlesArray[i].springForce(springX,springY)
    ParticlesArray[i].applyForces([ spring]);
    ParticlesArray[i].update();
    ParticlesArray[i].draw();

    fill(0);circle(springX,springY,5);
    push();stroke(0);strokeWeight(0.5);line(springX,springY,ParticlesArray[i].pos.x,ParticlesArray[i].pos.y);pop();
    
    ParticlesArray[i].checkEdgesBounceRadius();
    //ParticlesArray[i].checkEdgesBounceCentroid()
    //ParticlesArray[i].checkEdgesWrap();

  };


}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

  var {xCenter,yCenter} = myUtils.roundGrid(gridCellSize);
  springX = xCenter;
  springY = yCenter;

};

