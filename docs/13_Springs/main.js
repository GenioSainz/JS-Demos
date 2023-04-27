

var fr              = 30;
let nParticles      = 25;
let ParticlesArray  = [];
let particleOptions = {kd:0.001,
                       k:0.01,c:0.25,
                       radius:10,arrowLen:40,
                       drawPath:false,drawArrow:false,pathColor:[255,0,0],pathPoints:100}

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
  
  for(i=0;i<nParticles;i++){
    
       //ParticlesArray.push( new Particle( {x:0,y:windowHeight/2} ,{v_m:random(15,20),v_d:random(-30,-80)}, {g:0.05}, particleOptions) );
       //ParticlesArray.push( new Particle( {x:random(windowWidth),y:random(windowHeight)} ,{v_m:random(15,20),v_d:random(360)}, {g:0.05}, particleOptions) );
       var dxy  = windowHeight/2 -50;
       var xpos = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
       var ypos = random(windowHeight/2-dxy,windowHeight/2+dxy);

       particleOptions.color = myUtils.randColor();
       ParticlesArray.push( new Particle( {x:xpos,y:ypos} ,{v_m:0,v_d:0}, {g:0.0}, particleOptions) );
  }; 


};

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid();
  

  fill(120)

  if(mouseIsPressed){
    
    springX = mouseX;
    springY = mouseY;

  };

  for(let i=0;i<nParticles;i++){
     
    
    // var drag    = ParticlesArray[i].dragForce();
    // var gravity = ParticlesArray[i].gravity;
    var spring  = ParticlesArray[i].springForce(springX,springY)
    ParticlesArray[i].applyForces([ spring ]);
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

