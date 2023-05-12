

var fr              = 30;
var particleOptions = {kd:0.0001,vfriction:0.99,
                       k:0.01,c:0.25,
                       radius:15,arrowLen:40,
                       drawPath:false,drawArrow:false,pathColor:[255,0,0],pathPoints:100}
  
var ParticlesArray  = [];

var nParticles      = 15;
var nParticlesMin   = 1;
var nParticlesMax   = 30;
var nParticlesStep  = 1;

var springLength     = 150;
var springLengthMin  = 0;
var springLengthMax  = 300;
var springLengthStep = 25;

var stiffnessK       = 0.01;
var stiffnessKMin    = 0.01;
var stiffnessKMax    = 0.1;
var stiffnessKStep   = 0.01;

var dampingC         = 0.25
var dampingCMin      = 0.25
var dampingCMax      = 0.75
var dampingCStep     = 0.25

var springX;
var springY;
var gridCellSize = 50;

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  frameRate(fr);

  gui = createGui('Springs Controls').setPosition(gridCellSize,gridCellSize );
  gui.addGlobals('nParticles','springLength','stiffnessK','dampingC');

  var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,windowWidth/2,windowHeight/2);
  springX = xGrid;
  springY = yGrid;
  
  for(i=0;i<nParticlesMax;i++){

       var dxy  = windowHeight/2 -100;
       var xpos = random(windowWidth/2 -dxy,windowWidth/2 +dxy);
       var ypos = random(windowHeight/2-dxy,windowHeight/2+dxy);

       particleOptions.color = myUtils.randColor();
       ParticlesArray.push( new Particle( {x:xpos,y:ypos} ,{v_m:0,v_d:0}, {g:0}, particleOptions) );
  }; 


};

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid();
  

  fill(120)


  if(mouseIsPressed){
     
    var boolX = mouseX>0 && mouseX< 250;
    var boolY = mouseY>0 && mouseY< 350;

    if(!(boolX && boolY)){
        springX = mouseX;
        springY = mouseY;
    };

  };

  for(let i=0;i<nParticles;i++){
     
    var particle    = ParticlesArray[i];
        particle.k  = stiffnessK;
        particle.c  = dampingC;
    var drag        = particle.dragForce();
    var gravity     = particle.gravity;
    var springForce = particle.springForce(springX,springY,springLength);

    particle.applyForces([ springForce, gravity]);
    particle.checkEdgesBounceRadius();
    particle.update();
    particle.draw();

   
    push();

    // line fixed point spring (springX,springY) to equlibrium point (spring.x,spring.y)+(springX,springY)
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    var  dx     = particle.pos.x-springX;
    var  dy     = particle.pos.y-springY;
    var  spring = new p5.Vector( dx,dy )
         spring.setMag(springLength);
    
    strokeWeight(2);stroke(127);line( springX, springY, springX + spring.x, springY + spring.y);

    // line equlibrium point (spring.x,spring.y) to particle
    //////////////////////////////////////////////////////////
    strokeWeight(2);stroke(0);line( springX + spring.x, springY + spring.y, particle.pos.x, particle.pos.y);

         
    fill(255);circle(springX,springY,10);
    pop();

  };


}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

  var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,windowWidth/2,windowHeight/2);
  springX = xGrid;
  springY = yGrid;

};

