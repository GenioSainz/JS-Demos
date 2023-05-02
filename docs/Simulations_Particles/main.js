
;
let ParticlesArray = [];
let nParticles     = 20;
let particleOptions = {kd:0.00025,vfriction:1,
                       radius:15,arrowLen:40,
                       drawPath:true,pathColor:[0,0,0],pathPoints:50}


function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  
  for(i=0;i<nParticles;i++){
    

       ParticlesArray.push( new Particle( {x:0,y:windowHeight/2} ,{v_m:random(15,20),v_d:random(-30,-80)}, {g:0.05}, particleOptions) );

  }; 

};

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid();
  
  line(100,50,200,undefined)
  fill(120)

  for(let i=0;i<nParticles;i++){
     
    
    var d = ParticlesArray[i].dragForce();
    var g = ParticlesArray[i].gravity;
    ParticlesArray[i].applyForces([d,g]);
    ParticlesArray[i].update();
    ParticlesArray[i].draw();
  
    //ParticlesArray[i].checkEdgesBounceRadius();
    ParticlesArray[i].checkEdgesBounceCentroid()
    //ParticlesArray[i].checkEdgesWrap();

  };


}


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}