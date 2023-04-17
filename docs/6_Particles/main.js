
var fr             = 30
let ParticlesArray = [];
let nParticles     = 20;
let particleOptions = {drawPath:true,pathPoints:50}

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  frameRate(fr);
  
  for(i=0;i<nParticles;i++){
    
      // var ace = 0.075
      // p1 = new Particle({x:800,y:900}, {v_m:7.5,v_d:-95}, {a_m:0.035,a_d:90},{r:20});
      // p2 = new Particle({x:800,y:900}, {v_m:7.5,v_d:-90}, {a_m:0.035,a_d:90},{r:20});
      // p3 = new Particle({x:800,y:900}, {v_m:7.5,v_d:-85}, {a_m:0.035,a_d:90},{r:20});

      //ParticlesArray.push( new Particle({x:50,y:500} ,{v_m:7,v_d:-60},{a_m:ace,a_d:90},{r:20}) )
      //ace+=0.005

      //ParticlesArray.push( new Particle({x:windowWidth/2,y:windowHeight/2} ,{v_m:random(6,12),v_d:random(-120,-60)},{a_m:0.0,a_d:90},{r:10}) )
       //ParticlesArray.push( new Particle({x:windowWidth/2,y:windowHeight/2} ,{v_m:random(4,8),v_d:random(0,360)},{a_m:0.05,a_d:90},{r:10},particleOptions) );
      
       ParticlesArray.push( new Particle({x:0,y:windowHeight/2} ,{v_m:random(4,8),v_d:random(-30,-60)},{a_m:0.025,a_d:90},{r:10},particleOptions) );
  
       //ParticlesArray.push( new Particle({x:0,y:windowHeight} ,{v_m:random(8,10),v_d:random(-50,-40)},{a_m:0.05,a_d:90},{r:10},particleOptions) )
      }; 

}

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid();
  
  fill(120)

  for(let i=0;i<nParticles;i++){
     
    ParticlesArray[i].update();
    ParticlesArray[i].draw();

    if(ParticlesArray[i].pos.y<=0 || ParticlesArray[i].pos.y>=windowHeight ){
    
         let vN = p5.Vector.fromAngle(-PI/2,1);
         let vP = ParticlesArray[i].vel;
         let  m = vP.mag();
         let  d = vP.heading() + PI - 2*vN.angleBetween(vP);
         ParticlesArray[i].vel = new p5.Vector.fromAngle(d,m);
    };

    if(ParticlesArray[i].pos.x<=0 || ParticlesArray[i].pos.x>=windowWidth){
    
        let vN = p5.Vector.fromAngle(0,1);
        let vP = ParticlesArray[i].vel;
        let  m = vP.mag();
        let  d = vP.heading() + PI - 2*vN.angleBetween(vP);
        ParticlesArray[i].vel = new p5.Vector.fromAngle(d,m);
    };


  };

  push();


  
  pop()



}

function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}