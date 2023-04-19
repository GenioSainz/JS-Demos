// this script uses the SINE() function to create oscillating movement 
// between 0 and 1 to draw vertical and horizontal lines on the screen.

let h,w;

function setup() {
   
  w = windowWidth;
  h = windowHeight;
  createCanvas(w,h);
  frameRate(60)
  angleMode(DEGREES)

}

function draw() {
  
  background(220);strokeWeight(4);
  
  // dtheta        = 1;
  // theta         = theta + dtheta;
  var theta        = frameCount*0.25;
  var horizontal1  =  0.5*h*abs(sin(theta));
  var horizontal2  =  h- horizontal1;
  var vertical1    =  0.5*w*abs(sin(theta));
  var vertical2    =  w- vertical1;
  var rx           = vertical2-vertical1;
  var ry           = horizontal2-horizontal1;
  
  stroke(0,255,0);
  line(0,horizontal1,width,horizontal1);
  line(0,horizontal2,width,horizontal2);
  
  stroke(255,0,0);
  line(vertical1,0,vertical1,height);
  line(vertical2,0,vertical2,height);
  
  stroke(255,255,0);fill(0,0,255)
  ellipse(w/2,h/2,rx,ry);
  
  fill(255);textSize(30);stroke(0,0,0);
  textAlign(CENTER,CENTER)
  text('v1',vertical1,100);
  text('v2',vertical2,100);
  text('h1',100,horizontal1);
  text('h2',100,horizontal2);
  
  
};


function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);
  w = windowWidth;
  h = windowHeight;

};






