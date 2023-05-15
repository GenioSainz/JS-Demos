

var pointsOptions = {nPoints:4,radius:15}
var gridCellSize  = 50;

var points,p0,p1,p2,p3
var xIntersec;
var yIntersec;

function setup() {
    
  
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    
    points = new pointsDetection(pointsOptions);
    points.createRandom();
    
    p0 = points.pointsArray[0];
    p1 = points.pointsArray[1];
    p2 = points.pointsArray[2];
    p3 = points.pointsArray[3];
   
};

function draw() {
  
  background(255);strokeWeight(1);
  myUtils.drawGrid({cellSize:gridCellSize});

  points.mouseDetection();
  points.draw();
  drawLines();
  calcIntersec();

  noFill();circle(xIntersec,yIntersec,2*15)

  
};

function calcIntersec(){
         
         dem       = (p0.x-p1.x)*(p2.y-p3.y) - (p0.y-p1.y)*(p2.x-p3.x);

         xIntersec = (  (p0.x*p1.y-p0.y*p1.x)*(p2.x-p3.x) - (p0.x-p1.x)*(p2.x*p3.y-p2.y*p3.x)  )/dem;
         yIntersec = (  (p0.x*p1.y-p0.y*p1.x)*(p2.y-p3.y) - (p0.y-p1.y)*(p2.x*p3.y-p2.y*p3.x)  )/dem;
};

function drawLines(){
    
  
  push()
    strokeWeight(2)
    stroke(0,0,255);line(p0.x,p0.y,p1.x,p1.y)
    stroke(0,255,0);line(p2.x,p2.y,p3.x,p3.y)
  pop()
}


function mouseReleased(){
         
    points.pressUp();
};

function windowResized(){
  
    resizeCanvas(windowWidth, windowHeight);
};

