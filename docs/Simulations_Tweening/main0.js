

let noiseCoordAngle  = 0;
let ParticlesArray   = [];
let target
let nParticles      = 3;
let particleOptions = {radius:10,arrowLen:40,
                       drawPath:true,pathPoints:150}

let targetOptions = {radius:20,arrowLen:80,
                     drawPath:true, pathColor:[0,0,0],arrowColor:[0,0,0],pathPoints:150}

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
      var dis = Math.sqrt(ax**2+ay**2);

      var aceToTarget = new p5.Vector(ax,ay);
          aceToTarget.mult(k*0.025);
          particle.vel= aceToTarget
      
      particle.update();
      particle.draw();
      particle.checkEdgesBounceCentroid();



      if( dis < particleOptions.radius + targetOptions.radius ){

        particle.pos.x = 0;
        particle.pos.y = 0;
        particle.path  = [];
        target.radius  = 2*targetOptions.radius;
        target.color   = [255,255,0];
        setTimeout(()=>{ target.radius = targetOptions.radius 
                         target.color  = [127,127,127];
                       }, 500)
      };
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

  var angleNoise  =  map( noise(noiseCoordAngle  +=0.05 ), 0, 1,-2,2)*PI/180;

  target.vel.rotate(angleNoise);

  target.update();
  target.draw();
  target.checkEdgesBounceCentroid();



}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}