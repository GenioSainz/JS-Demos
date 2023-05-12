

let noiseCoordAngle  = 0;
let ParticlesArray   = [];
let target
let nParticles      = 1;
let particleOptions = {radius:10,arrowLen:40,
                       drawPath:false,pathPoints:150}

let targetOptions = {radius:1,arrowLen:0,
                     drawPath:false, pathColor:[0,0,0],arrowColor:[0,0,0],pathPoints:150}

var F22;
var kF22 = 0.25

var SU27;
var kSU27= 0.1;

var f22Out  = false;
var su27Out = false;

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  
  for(i=0;i<nParticles;i++){
    
        var limit = 100;
       ParticlesArray.push( new Particle( {x:random(limit,windowWidth-limit),y:random(limit,windowHeight-limit)} ,{v_m:random(2,4),v_d:random(-30,-80)}, {g:0.05}, particleOptions) );
       
       if(i==1){
        ParticlesArray[i].pathColor  = [0,255,0];
        ParticlesArray[i].arrowColor = [0,255,0];
       };
       if(i==2){
        ParticlesArray[i].pathColor  = [0,0,255];
        ParticlesArray[i].arrowColor = [0,0,255];
       };
  }; 

      target  = new Particle( {x:windowWidth/2,y:windowHeight/2} ,{v_m:5,v_d:random(360)}, {g:0.05}, targetOptions)

      F22  = loadImage('../imgs/F22.png' , F22  => { image(F22,  0, 0) });
      SU27 = loadImage('../imgs/SU27.png', SU27 => { image(SU27, 0, 0) });

};

function draw() {
  
  background(240);strokeWeight(2);myUtils.drawGrid();

  // PARTICLE UPDATE
  ////////////////////
  for(let i=0;i<nParticles;i++){
     
      var particle = ParticlesArray[i];
      
      var k   = 1-0.25*i; // k = 1, 0.75, 0.5
      var ax  = target.pos.x - particle.pos.x;
      var ay  = target.pos.y - particle.pos.y;

      var aceToTarget = new p5.Vector(ax,ay);
          aceToTarget.mult(k*0.025);
          particle.vel= aceToTarget
      
      particle.update();
      particle.draw();



      push()

        translate(particle.pos.x ,particle.pos.y );
        var w = SU27.width *kSU27;
        var h = SU27.height*kSU27;
        rotate(180 + particle.vel.heading()*180/PI)
        image(SU27,-w/2,-h/2,w,h)
  
      pop()

  };

  
  // TARGET UPDATE
  //////////////////
  if(mouseIsPressed){

    target.drawArrow=false;
    target.path  = [];
    target.pos.x = mouseX;
    target.pos.y = mouseY;
    target.vel   = particle.vel;
    target.vel.setMag( target.v_m );

  }else{
    target.drawArrow=true;
  };

  var angleNoise  =  map( noise(noiseCoordAngle  +=0.01 ), 0, 1,-1,1)*PI/180;

  target.vel.rotate(angleNoise);
  
  su27Out = particle.outEdges();
  f22Out  = target.outEdges();

  if( su27Out && f22Out){
    
    target.checkEdgesWrap()
    // particle.pos.x = target.pos.x +1*target.pos.x;
    // particle.pos.y = target.pos.y +1*target.pos.y;

    // particle.vel.x = target.vel.x
    // particle.vel.y = target.vel.y

  }else if(su27Out && !f22Out){

    particle.pos.x = target.pos.x +1*target.pos.x;
    particle.pos.y = target.pos.y +1*target.pos.y;

    particle.vel.x = target.vel.x
    particle.vel.y = target.vel.y


  };

  target.update();
  target.draw();



  push()

    translate(target.pos.x ,target.pos.y );
    var w = F22.width *kF22;
    var h = F22.height*kF22;
    rotate(180 + target.vel.heading()*180/PI)
    image(F22,-w/2,-h/2,w,h)


  pop()



}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}