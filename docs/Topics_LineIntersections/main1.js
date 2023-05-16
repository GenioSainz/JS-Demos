

var gridCellSize  = 50;

var starCenters;
var star0;
var star1;

var R1 = 50;
var R2 = 150;

var starsIntersec = false;

function setup() {
    
  
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    

    starCenters = new pointsDetection({nPoints:2,radius:R1/2});
    starCenters.createRandom();

    star0         = calcStar(starCenters.pointsArray[0]);
    star1         = calcStar(starCenters.pointsArray[1]);
    starsIntersec = checkStarCollision(star0, star1)
  
};

function draw() {
  
  background(255);strokeWeight(1);
  myUtils.drawGrid({cellSize:gridCellSize});


  if(mouseIsPressed){

    star0         = calcStar(starCenters.pointsArray[0]);
    star1         = calcStar(starCenters.pointsArray[1]);
    starsIntersec = checkStarCollision(star0, star1)
  };


  drawStar(star0);
  drawStar(star1);

  starCenters.mouseDetection();
  starCenters.draw();

  
};


function calcStar(center){
    
    var x0 = center.x;
    var y0 = center.y;
    
    var star        = {};
        star.x0     = x0;
        star.y0     = y0;
        star.points = []

    var n = 1;
    for(let i=0;i<=360;i+=180/4){

        if(n%2==0){

            var x = x0 + R1*cos(i);
            var y = y0 + R1*sin(i);
            star.points.push({x,y});

        }else{

            var x = x0 + R2*cos(i);
            var y = y0 + R2*sin(i);
            star.points.push({x,y});
        };
        
        n++
    };

    return star
}

function drawStar(star){ 

    if(starsIntersec){
      fill(255,255,0)
    }else{
      noFill();
    };
    
    beginShape();

    star.points.forEach( point => {
      vertex(point.x,point.y);
    });

    endShape();

};

function checkStarCollision(starA, starB) {
  
    // in the last iteration return to 0
    // star.points[(i + 1) % star.points.length]

    for(var i = 0; i < starA.points.length; i++) {

        var p0 = starA.points[i];
        var p1 = starA.points[(i + 1) % starA.points.length];

        for(var j = 0; j < starB.points.length; j++) {
            var p2 = starB.points[j];
            var p3 = starB.points[(j + 1) % starB.points.length];

            if(calcIntersec(p0, p1, p2, p3)) {
              return true;
            };
        };
    };
    
    return false;

};

function calcIntersec(p0,p1,p2,p3){

    var xLineIntersec;
    var yLineIntersec;
    var dem;
         
    dem = (p0.x-p1.x)*(p2.y-p3.y) - (p0.y-p1.y)*(p2.x-p3.x);

    xLineIntersec = (  (p0.x*p1.y-p0.y*p1.x)*(p2.x-p3.x) - (p0.x-p1.x)*(p2.x*p3.y-p2.y*p3.x)  ) / dem;
    yLineIntersec = (  (p0.x*p1.y-p0.y*p1.x)*(p2.y-p3.y) - (p0.y-p1.y)*(p2.x*p3.y-p2.y*p3.x)  ) / dem;

    var rx0 = ( xLineIntersec - p0.x ) / ( p1.x-p0.x );
    var ry0 = ( yLineIntersec - p0.y ) / ( p1.y-p0.y );
    var rx1 = ( xLineIntersec - p2.x ) / ( p3.x-p2.x );
    var ry1 = ( yLineIntersec - p2.y ) / ( p3.y-p2.y );

    var boolr0 = (rx0 >= 0 && rx0<=1) ||  (ry0 >= 0 && ry0<=1);
    var boolr1 = (rx1 >= 0 && rx1<=1) ||  (ry1 >= 0 && ry1<=1);

    if(boolr0 && boolr1){

      return true 
    
    }else{

       return false
    };

};

function mouseReleased(){
         
    starCenters.pressUp();
};

function windowResized(){
  
    resizeCanvas(windowWidth, windowHeight);
};

