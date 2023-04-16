// In this script the ATAN2() and MAP() function is used to control the movement and rotation of two arrows:
// - white: pointing in the direction of the mouse.
// -   red: pointing in the mouse translation direction.

var fr  = 20;
var px  = 0;
var py  = 0;
var ktxt = 25;
var segLength = 200;
var p1,p2,te1;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  frameRate(fr);
  
}

function draw() {
  
  background(240);strokeWeight(2);noFill()
  myUtils.drawGrid({cellSize:100});
  
  stroke([0,0,0]);fill([255,0,0])
  
  // CALC DISTANCES-ANGLES
  //////////////////////////  
  var dx = mouseX-px;
  var dy = mouseY-py;
  var te1 = atan2(dy,dx);
  
  px = mouseX - cos(te1)*segLength;
  py = mouseY - sin(te1)*segLength;

  p2 = [mouseX,mouseY];
  p1 = [px,py]

  // PLOT MOVING ARROW ----> P1---> P2
  ////////////////////////////////
  push()
    fill(125);textSize(16);
    circle(px,py,100)
    myUtils.drawArrow([px,py], [mouseX,mouseY],{color:[255,0,0],double:true})
    fill(0);
    text(`P2`, mouseX+cos(te1)*ktxt, mouseY+sin(te1)*ktxt)
    text(`P1`, px    -cos(te1)*ktxt, py    -sin(te1)*ktxt)
  pop()
  
   // INITIAL TEXT
   /////////////////
  push()
    fill(0);textSize(28);textAlign(CENTER,CENTER)
    var tarL = 4;
    var txt1 = round(dx).toString().padStart(tarL, " ");
    var txt2 = round(dy).toString().padStart(tarL, " ");
    var txt3 = round(te1).toString().padStart(tarL, " ");
    text(`mouseX:${mouseX}  mouseY:${mouseY}  pX:${round(px)}  pY:${round(py)}`,windowWidth/2,50)
    text(`dX:${txt1}  dY:${txt2}  Sign:${Math.sign(dy/dx)}  Alpha:${txt3}`     ,windowWidth/2,90)
    text(`dXcos:${round(- cos(te1)*segLength)}  dYsin:${round(-sin(te1)*segLength)}`     ,windowWidth/2,130)
  pop()


  push()

    // CENTRAL CIRCLE COORDINATES SYSTEM
    ///////////////////
    var xc      = windowWidth/2;
    var yc      = windowHeight/2;
    var dc      = 300;
    var axis_x1 = [xc,yc];
    var axis_x2 = [xc + map(mouseX, 0, windowWidth,0, dc/2),yc];
    var axis_y1 = [xc,yc];
    var axis_y2 = [xc,yc + + map(mouseY, 0, windowHeight,0, dc/2)];
    
    fill(125)
    circle(xc,yc,dc);

    fill(0);textSize(25)
    myUtils.drawArrow(axis_x1,axis_x2);textAlign(LEFT,CENTER);text(`+X`,xc+dc/2+10,yc)  // X AXIS
    myUtils.drawArrow(axis_y1,axis_y2);textAlign(CENTER,TOP);text(`+Y` ,xc,yc+dc/2+10)  // Y AXIS
    myUtils.drawArrow(axis_y1,[xc+cos(te1)*dc/2,yc+sin(te1)*dc/2],{color:[255,0,0]});   // ARROW ANGLE ATAN2(y,x)

    var dx  = mouseX-xc;
    var dy  = mouseY-yc;
    var te2 = atan2(dy,dx);
    
    var maxDistance = sqrt( (windowWidth/2)**2+ (windowHeight/2)**2);
    var distance    = sqrt( (0.5*windowWidth-mouseX)**2+ (0.5*windowHeight-mouseY)**2);
    var arrowLen    = map(distance, 0, maxDistance,0, dc/2);
    myUtils.drawArrow([xc,yc],[xc+cos(te2)*arrowLen,yc+sin(te2)*arrowLen],{color:[255,255,255],arrowHead:0.2}); // ARROW ANGLE MOUSE
  pop()

  var coords = myUtils.drawJoystick({joystickLen:300});
  

};


function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight)

};