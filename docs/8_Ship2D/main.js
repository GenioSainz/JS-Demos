
var particle ;
let particleOptions = {drawPath:true,drawParticle:false,pathPoints:50};
let particleAngle   = 0;
let turningLeft     = false;
let turningRight    = false;
let thrustingUp     = false;
let thrustingDown   = false;

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER)
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

    if(thrustingUp) {
      particle.ace = new p5.Vector.fromAngle(particleAngle*PI/180,0.25);

    }else if(thrustingDown){
       particle.ace = new p5.Vector.fromAngle( PI + particle.vel.heading(),0.3);

    }else {
      particle.ace = new p5.Vector.fromAngle(0,0);
    };

      
    particle.update();
    particle.draw();

    var x = particle.pos.x;
    var y = particle.pos.y;

    drawShip(x,y);
    collisionDetec(x,y,{collisionSquare:true});
    drawVectorDiagram(150,200);
    drawKeys(125,300);

  };

function drawVectorDiagram(circle_x,circle_y){

    // var circle_x = 150;
    // var circle_y = 200;
    var circle_r = 100;
    
    var module_ace = particle.ace.mag();
    if(module_ace!=0){
      module_ace = circle_r
    };
    
    var max_v      = 15;
    var module_vel = map(particle.vel.mag(),0,max_v,0,circle_r);
    if(module_vel>circle_r){module_vel=circle_r};;

    push();
      fill(180);
      strokeWeight(2);
        circle(circle_x,circle_y,2.0*circle_r);

      strokeWeight(0.5);
        circle(circle_x,circle_y,1.5*circle_r);
        circle(circle_x,circle_y,0.5*circle_r);
        line(circle_x,circle_y-3*circle_r/4,circle_x,circle_y+3*circle_r/4);
        line(circle_x-3*circle_r/4,circle_y,circle_x+3*circle_r/4,circle_y);

      strokeWeight(2);
      myUtils.drawArrow([circle_x,circle_y],[circle_x + particle.ace.x,circle_y + particle.ace.y,],{module:module_ace,color:[255,255,0], arrowHead:0.1});
      myUtils.drawArrow([circle_x,circle_y],[circle_x + particle.vel.x,circle_y + particle.vel.y,],{module:module_vel,color:[0,0,255], arrowHead:0.2});

    pop();

    push()

      fill(180);
      
      var h = 50;
      rect(circle_x ,circle_y - circle_r - h/2, 0.8*2*circle_r,h*0.8,5)

      textAlign(CENTER,CENTER);textSize(15)
      fill(255,255,0);
      text('Aceleration Vector',circle_x, circle_y - circle_r - 35);
      fill(0,0,255);
      text('Velocity Vector'   ,circle_x, circle_y - circle_r - 15);
      push();

    pop()

}

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

    fill(180);        triangle(x1, y1, x2, y2, x3, y3);
    fill(255,255,255);circle(0,0,len/5);
    
    if(thrustingUp) {
      line(0,y3,0,y3+h);
      line(0,y3,len/4,y3+h);
      line(0,y3,-len/4,y3+h);
      // line(x2,y2,x2-len,len*sin(30));line(x2,y2,x2-len,len*sin(60));
      // line(x2,y2,x2+len,len*sin(30));line(x2,y2,x2+len,len*sin(60));
    }else if(thrustingDown){
      line(x1,y1,x1-sin(30)*len,y1-len*cos(30));
      line(x1,y1,x1-sin(45)*len,y1-len*cos(45));
      line(x3,y1,x3+sin(30)*len,y1-len*cos(30));
      line(x3,y1,x3+sin(45)*len,y1-len*cos(45));
      
    }
    
  pop()

};

function collisionDetec(x,y,{collisionSquare=true}={}){

   // SQUARE MODE
  if(collisionSquare){

        if( y<0 || y>windowHeight ){

              let vN = p5.Vector.fromAngle(-PI/2,1);
              let vP = particle.vel;
              let  m = vP.mag();
              let  d = vP.heading() + PI - 2*vN.angleBetween(vP);
              particle.vel = new p5.Vector.fromAngle(d,m);
              
        }else if( x<0 || x>windowWidth){

            let vN = p5.Vector.fromAngle(0,1);
            let vP = particle.vel;
            let  m = vP.mag();
            let  d = vP.heading() + PI - 2*vN.angleBetween(vP);
            particle.vel = new p5.Vector.fromAngle(d,m);
        };
  // 360 MODE
  }else{ 

        if( y<0 ){
          particle.pos = createVector(x,windowHeight);

        }else if(y>windowHeight){
          particle.pos = createVector(x,0);

        }else if(x<0){
          particle.pos = createVector(windowWidth,y);

        }else if(x>windowWidth){
          particle.pos = createVector(0,y);

        };

  }

};

function keyEvents(){

  document.addEventListener("keydown", (event) => {
    
    if(event.code=="ArrowUp"){

       thrustingUp = true;

    }else if(event.code=="ArrowDown"){
      
       thrustingDown = true;

    }else if(event.code=="ArrowRight"){

       turningRight = true;
   
    }else if(event.code=="ArrowLeft"){

       turningLeft = true;
    };

  });

  document.addEventListener("keyup", (event) => {
    
    if(event.code=="ArrowUp"){

       thrustingUp = false;

    }else if(event.code=="ArrowDown"){
      
       thrustingDown = false;

    }else if(event.code=="ArrowRight"){

       turningRight = false;
   
    }else if(event.code=="ArrowLeft"){

       turningLeft = false;
    };
    
  });

};

function drawKeys(xcr,ycr){
      
      // COORDINATES
      // (xcr,ycr) = left corner bounding box up key
      // var xcr    = roundGrid(windowWidth/2,50);
      // var ycr    = 50;
      // var xcr = 100;
      // var ycr = 300

      var size   = 50;
      var ksize  = size*0.8;
      var xor    = xcr + size/2;
      var yor    = ycr + size/2;
      var arrow2 = size/5;

      var x_centerUp = xor;
      var y_centerUp = yor;

      var x_centerDown = xor;
      var y_centerDown = yor+size;

      var x_centerRight = xor+size;
      var y_centerRight = yor+size;
      var x_cornerRight = x_centerRight-ksize/2;
      var y_cornerRight = y_centerRight-ksize/2;

      var x_centerLeft = xor-size;
      var y_centerLeft = yor+size;
      var x_cornerLeft = x_centerLeft-ksize/2;
      var y_cornerLeft = y_centerLeft-ksize/2;

      
      // COLLISION DETECTION
      var boolUp    = (mouseX>=xcr && mouseX<=xcr + ksize) && (mouseY>=ycr && mouseY<=ycr + ksize);
      var boolDown  = (mouseX>=xcr && mouseX<=xcr + ksize) && (mouseY>=y_centerDown-ksize/2 && mouseY<=y_centerDown + ksize/2);
      var boolRight = (mouseX>=x_cornerRight && mouseX<=x_cornerRight + ksize) && (mouseY>=y_cornerRight && mouseY<=y_cornerRight + ksize);
      var boolLeft  = (mouseX>=x_cornerLeft  && mouseX<=x_centerLeft  + ksize) && (mouseY>=y_cornerLeft  && mouseY<=y_cornerLeft  + ksize);

      // DRAW KEYS
      fill(180);strokeWeight(2)
      rect(x_centerUp,    y_centerUp,    ksize, ksize, size/10); //up
      rect(x_centerDown,  y_centerDown,  ksize, ksize, size/10); //down
      rect(x_centerRight, y_centerRight, ksize, ksize, size/10); //right
      rect(x_centerLeft,  y_centerLeft,  ksize, ksize, size/10); //left
      
      myUtils.drawArrow([x_centerUp,y_centerUp+arrow2 ],[x_centerUp,y_centerUp-arrow2 ],{arrowHead:0.5,color:[255,255,255]});
      myUtils.drawArrow([x_centerDown,y_centerDown-arrow2 ],[x_centerDown,y_centerDown+arrow2],{arrowHead:0.5,color:[255,255,255]});
      myUtils.drawArrow([x_centerRight-arrow2,y_centerRight],[x_centerRight+arrow2,y_centerRight],{arrowHead:0.5,color:[255,255,255]});
      myUtils.drawArrow([x_centerLeft+arrow2,y_centerLeft],[x_centerLeft-arrow2,y_centerLeft],{arrowHead:0.5,color:[255,255,255]});


      // THRUSTING BY KEYBOARD
      if(thrustingUp){
        fill(255,0,0)
        rect(x_centerUp,  y_centerUp,  ksize, ksize, size/10); //up
        myUtils.drawArrow([x_centerUp,y_centerUp+arrow2 ],[x_centerUp,y_centerUp-arrow2 ],{arrowHead:0.5,color:[255,255,255]});

      };if(thrustingDown){
        fill(255,0,0);
        rect(x_centerDown,  y_centerDown,  ksize, ksize, size/10); //down
        myUtils.drawArrow([x_centerDown,y_centerDown-arrow2 ],[x_centerDown,y_centerDown+arrow2],{arrowHead:0.5,color:[255,255,255]});
  
      };if(turningRight){
        fill(255,0,0);
        rect(x_centerRight, y_centerRight, ksize, ksize, size/10); //right
        myUtils.drawArrow([x_centerRight-arrow2,y_centerRight],[x_centerRight+arrow2,y_centerRight],{arrowHead:0.5,color:[255,255,255]});

      };if(turningLeft){
        fill(255,0,0);
        rect(x_centerLeft,  y_centerLeft,  ksize, ksize, size/10);//left
        myUtils.drawArrow([x_centerLeft+arrow2,y_centerLeft],[x_centerLeft-arrow2,y_centerLeft],{arrowHead:0.5,color:[255,255,255]});

      };

      // THRUSTING BY SCREEN KEYS
      if(boolUp){
        fill(255,0,0)
        rect(x_centerUp,  y_centerUp,  ksize, ksize, size/10); //up
        myUtils.drawArrow([x_centerUp,y_centerUp+arrow2 ],[x_centerUp,y_centerUp-arrow2 ],{arrowHead:0.5,color:[255,255,255]});
        ( mouseIsPressed ) ? thrustingUp = true: thrustingUp = false;
      };

      if(boolDown){
        fill(255,0,0);
        rect(x_centerDown,  y_centerDown,  ksize, ksize, size/10); //down
        myUtils.drawArrow([x_centerDown,y_centerDown-arrow2 ],[x_centerDown,y_centerDown+arrow2],{arrowHead:0.5,color:[255,255,255]});
        ( mouseIsPressed ) ? thrustingDown = true: thrustingDown = false;
      };

      if(boolRight){
        fill(255,0,0);
        rect(x_centerRight, y_centerRight, ksize, ksize, size/10); //right
        myUtils.drawArrow([x_centerRight-arrow2,y_centerRight],[x_centerRight+arrow2,y_centerRight],{arrowHead:0.5,color:[255,255,255]});
        ( mouseIsPressed ) ? turningRight = true: turningRight = false;

      };
      if(boolLeft){
        fill(255,0,0);
        rect(x_centerLeft,  y_centerLeft,  ksize, ksize, size/10);//left
        myUtils.drawArrow([x_centerLeft+arrow2,y_centerLeft],[x_centerLeft-arrow2,y_centerLeft],{arrowHead:0.5,color:[255,255,255]});
        ( mouseIsPressed ) ? turningLeft = true: turningLeft = false;
      }

};

function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}

function roundGrid(value,cellSize){

	return Math.floor( value / cellSize + 0.5) * cellSize;

}