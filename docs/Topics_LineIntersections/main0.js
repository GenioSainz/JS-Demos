

var pointsOptions = {nPoints:4,radius:15}
var gridCellSize  = 50;

var points,p0,p1,p2,p3
var xLineIntersec;
var yLineIntersec;
var xSegmentIntersec;
var ySegmentIntersec;

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

  drawLines();

  points.mouseDetection();
  points.draw();


  calcIntersec();
  noFill();     circle(xLineIntersec,yLineIntersec,      2*10)
  fill(255,0,0);circle(xSegmentIntersec,ySegmentIntersec,2*10)

  
};

function calcIntersec(){
         
         dem       = (p0.x-p1.x)*(p2.y-p3.y) - (p0.y-p1.y)*(p2.x-p3.x);

         xLineIntersec = (  (p0.x*p1.y-p0.y*p1.x)*(p2.x-p3.x) - (p0.x-p1.x)*(p2.x*p3.y-p2.y*p3.x)  )/dem;
         yLineIntersec = (  (p0.x*p1.y-p0.y*p1.x)*(p2.y-p3.y) - (p0.y-p1.y)*(p2.x*p3.y-p2.y*p3.x)  )/dem;

         var rx0 = ( xLineIntersec - p0.x ) / ( p1.x-p0.x );
         var ry0 = ( yLineIntersec - p0.y ) / ( p1.y-p0.y );
         var rx1 = ( xLineIntersec - p2.x ) / ( p3.x-p2.x );
         var ry1 = ( yLineIntersec - p2.y ) / ( p3.y-p2.y );

         var boolr0 = (rx0 >= 0 && rx0<=1) ||  (ry0 >= 0 && ry0<=1);
         var boolr1 = (rx1 >= 0 && rx1<=1) ||  (ry1 >= 0 && ry1<=1);

         if(boolr0 && boolr1){
            
          xSegmentIntersec = xLineIntersec;
          ySegmentIntersec = yLineIntersec;

         }else{

          xSegmentIntersec = NaN;
          ySegmentIntersec = NaN;

         }


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

