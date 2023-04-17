

var particle 
let particleOptions = {drawPath:true,drawParticle:false,pathPoints:50};
let particleAngle   = 0;
let turningLeft     = false;
let turningRight    = false;
let thrusting       = false;

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  frameRate(30);
  
  particle = new Particle({x:windowWidth/2,y:windowHeight/2} ,{v_m:0,v_d:0},{a_m:0.0,a_d:0},{r:100},particleOptions);

  keyEvents();

}

function draw() {
  
    background(240);strokeWeight(2);noFill()
    myUtils.drawGrid();
    fill(120)

    if(turningLeft) {
      particleAngle -= 5;
    };
    if(turningRight) {
      particleAngle += 5;
    };

    if(thrusting) {
      particle.ace = new p5.Vector.fromAngle(particleAngle*PI/180,0.25);
    }else {
      particle.ace = new p5.Vector.fromAngle(particleAngle*PI/180,0);
    };

      
    particle.update();
    particle.draw();

    var x = particle.pos.x;
    var y = particle.pos.y;

    drawShip(x,y);
    collisionDetec(x,y)


  };


function drawShip(x,y){

  push()


    translate(x,y)
    rotate(particleAngle+90)
    var len = 50;
    var h   = tan(70)*len/2;

    var x1 = - len/2;
    var y1 =    h - 2*h/3

    var x2 = 0;
    var y2 = 0 - 2*h/3;

    var x3 = + len/2
    var y3 =   h - 2*h/3; 

    myUtils.drawArrow([0,0],[0,-2*len],{color:[255,0,0]});

    triangle(x1, y1, x2, y2, x3, y3);

    if(thrusting) {
      stroke(255,0,0)
      line(0,y3,0,y3+h);
      line(0,y3,len/2,y3+h);
      line(0,y3,-len/2,y3+h);
    }

  pop()

}

function collisionDetec(x,y){

    if( y<=0 || y>=windowHeight ){

          let vN = p5.Vector.fromAngle(-PI/2,1);
          let vP = particle.vel;
          let  m = vP.mag();
          let  d = vP.heading() + PI - 2*vN.angleBetween(vP);
          particle.vel = new p5.Vector.fromAngle(d,m);
    };

    if( x<=0 || x>=windowWidth){

        let vN = p5.Vector.fromAngle(0,1);
        let vP = particle.vel;
        let  m = vP.mag();
        let  d = vP.heading() + PI - 2*vN.angleBetween(vP);
        particle.vel = new p5.Vector.fromAngle(d,m);
    };

}

function keyEvents(){

  document.addEventListener("keydown", (event) => {
    
    if(event.code=="ArrowUp"){

       thrusting = true;

    }else if(event.code=="ArrowRight"){

       turningRight = true;
   
    }else if(event.code=="ArrowLeft"){

       turningLeft = true;
    };

  });

  document.addEventListener("keyup", (event) => {
    
    if(event.code=="ArrowUp"){

       thrusting = false;

    }else if(event.code=="ArrowRight"){

       turningRight = false;
   
    }else if(event.code=="ArrowLeft"){

      turningLeft = false;
    };
    
  });

};


function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}