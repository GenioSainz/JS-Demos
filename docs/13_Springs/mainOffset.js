

var fr              = 30;
let nParticles      = 1;
let ParticlesArray  = [];
let springLen       = 100;
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
    
       var dxy  = springLen+100;
       var xpos = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
       var ypos = random(windowHeight/2-dxy,windowHeight/2+dxy);

       particleOptions.color = myUtils.randColor();
       ParticlesArray.push( new Particle( {x:xpos,y:ypos} ,{v_m:0,v_d:0}, {g:0.5}, particleOptions) );
  }; 
;

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

  for(let i=0;i<nParticles;i++){
     
    // var drag    = ParticlesArray[i].dragForce();
    // var gravity = ParticlesArray[i].gravity;
    var spring  = ParticlesArray[i].springForceOffset(springX,springY,springLen)
    ParticlesArray[i].applyForces([spring]);
    ParticlesArray[i].update();
    ParticlesArray[i].draw();

    fill(0);
    push();
      stroke(0);strokeWeight(2);
      line(springX,springY,ParticlesArray[i].pos.x,ParticlesArray[i].pos.y);

      var dy  = ParticlesArray[i].pos.y - springY;
      var dx  = ParticlesArray[i].pos.x - springX;
      var p1  = [springX,springY]
      var p2  = [springX+springLen*cos(atan2(dy,dx)),springY+springLen*sin(atan2(dy,dx))];
      strokeWeight(2.5);stroke(255,0,0);line(p1[0],p1[1],p2[0],p2[1]);
      circle(springX,springY,10);

    pop();
    
    ParticlesArray[i].checkEdgesBounceRadius();

  };


}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

  var {xCenter,yCenter} = myUtils.roundGrid(gridCellSize);
  springX = xCenter;
  springY = yCenter;

};

