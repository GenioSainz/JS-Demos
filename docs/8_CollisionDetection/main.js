
var c1 = {};
var c2 = {};
var r1 = {};
var r2 = {}
var collisionColorCircle;
var collisionColorRect;
var gui;

var mouseControl = ['ToCenter','ToMouse'];

function setup() {

  createCanvas(windowWidth, windowHeight);textAlign(CENTER,CENTER);textStyle(BOLD);rectMode(CENTER)

  c2.r = 80;
  c2.x = windowWidth/3;
  c2.y = windowHeight/2;

  c1.r = 50;
  c1.x = random(c2.x-2*c2.r,c2.x+2*c2.r);
  c1.y = random(c2.y-2*c2.r,c2.y+2*c2.r);

  r2.w = 300;
  r2.h = 200;
  r2.x = 2*windowWidth/3;
  r2.y = windowHeight/2;

  r1.w = 100;
  r1.h = 200;
  r1.x = random(r2.x-r2.w,r2.x+r2.w);
  r1.y = random(r2.y-r2.h,r2.y+r2.h);

  gui = createGui('Mouse Control').setPosition(50,50);
  gui.addGlobals('mouseControl');
  

}

function draw() {
  
    background(240);strokeWeight(2);
    
    myUtils.drawGrid();fill(180);


    circleMouseDetection(c1);
    circleCollisionDetection();
    
    fill(collisionColorCircle);circle(c2.x,c2.y,2*c2.r);fill(0);text('C2',c2.x,c2.y)
    fill(collisionColorCircle);circle(c1.x,c1.y,2*c1.r);fill(0);text('C1',c1.x,c1.y);noFill();circle(c1.x,c1.y,25)
    
    rectMouseDetection(r1);
    rectCollisionDetection();
    fill(collisionColorRect);rect(r2.x,r2.y,r2.w,r2.h);fill(0);text('R2',r2.x,r2.y);
    fill(collisionColorRect);rect(r1.x,r1.y,r1.w,r1.h);fill(0);text('R1',r1.x,r1.y);noFill();circle(r1.x,r1.y,25)


};

function distanceCircles(c1,c2){

  return sqrt( (c1.x-c2.x)**2 + (c1.y-c2.y)**2)
};

function circleMouseDetection(circle){

  var boolDistance = sqrt((mouseX-circle.x)**2+(mouseY-circle.y)**2)<=circle.r;

  if( mouseIsPressed && boolDistance ){
      
    if(mouseControl=='ToCenter'){

         circle.x  = mouseX;
         circle.y  = mouseY;

     }else if(mouseControl=='ToMouse'){

         var dx    = mouseX-circle.x;
         var dy    = mouseY-circle.y;
         var theta = atan2(dy,dx);
         circle.x  = circle.x + cos(theta);
         circle.y  = circle.y + sin(theta);
     }
  };
};

function circleCollisionDetection(){

  if (distanceCircles(c1,c2) <= c1.r+c2.r){
    collisionColorCircle = [0,255,0];
  }else{
    collisionColorCircle = [255,0,0];
  }
};


function rectMouseDetection(rect){

  var boolX = mouseX >= rect.x-rect.w/2 && mouseX <= rect.x+rect.w/2;
  var boolY = mouseY >= rect.y-rect.h/2 && mouseY <= rect.y+rect.h/2;

  if( mouseIsPressed && ( boolX && boolY )){

      if(mouseControl=='ToCenter'){
         rect.x = mouseX;
         rect.y = mouseY;

      }else if(mouseControl=='ToMouse'){
          var dx    = mouseX-rect.x;
          var dy    = mouseY-rect.y;
          var theta = atan2(dy,dx);
          rect.x    = rect.x + cos(theta);
          rect.y    = rect.y + sin(theta);
      }
  };
}

function rangeOverlap(rangeA,rangeB){

  var bool1 = Math.max(rangeA[0],rangeA[1]) >= Math.min(rangeB[0],rangeB[1]);
  var bool2 = Math.min(rangeA[0],rangeA[1]) <= Math.max(rangeB[0],rangeB[1]);
  
  if( bool1 && bool2 ){

    return true

  }else{

    return false
  };

};

function rectCollisionDetection(){
    
         var r1_rangeX = [ r1.x-r1.w/2, r1.x+r1.w/2 ];
         var r2_rangeX = [ r2.x-r2.w/2, r2.x+r2.w/2 ];

         var r1_rangeY = [ r1.y-r1.h/2, r1.y+r1.h/2] ;
         var r2_rangeY = [ r2.y-r2.h/2, r2.y+r2.h/2 ];

         var boolX = rangeOverlap( r1_rangeX, r2_rangeX );
         var boolY = rangeOverlap( r1_rangeY, r2_rangeY );

         if(boolX && boolY){

          collisionColorRect = [255,255,0];
         }else{

          collisionColorRect = [255,0,255];
         }

}

 
function windowResized(){
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}

