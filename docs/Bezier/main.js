
var gui;

var t     = 0.5;
var tMin  = 0;
var tMax  = 1;
var tStep = 0.01

var gridCellSize = 25;
var rPoint       = 8;

var p0,p1,p2;
var arrayBezier = [];

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    gui = createGui('Bezier').setPosition(gridCellSize,gridCellSize );
    gui.addGlobals('t');

    // control points
    p0 = new p5.Vector(300,500);
    p1 = new p5.Vector(500,100);
    p2 = new p5.Vector(800,600);

    listenSliders();

    calcBezierArray([p0,p1,p2],t);

};

function draw() {
  
  background(240);strokeWeight(1);myUtils.drawGrid({cellSize:gridCellSize});textAlign(CENTER,BOTTOM)


  plotBezierArray(arrayBezier)
  pointDetection(p0,rPoint);fill(0);text('p0',p0.x,p0.y-rPoint);
  pointDetection(p1,rPoint);fill(0);text('p1',p1.x,p1.y-rPoint);
  pointDetection(p2,rPoint);fill(0);text('p2',p2.x,p2.y-rPoint);

  
  // medium points
  var pt_01    = vector_p0p1t(p0,p1,t,rPoint);
  var pt_12    = vector_p0p1t(p1,p2,t,rPoint);
  var pt_01_02 = vector_p0p1t(pt_01,pt_12,t,rPoint,drawt=true);

}


function vector_p0p1t(p0,p1,t,rPoint,drawt=false){
          
          /// v01 = p0 --> p1
          //   p1 = p0 + v01
          var v01 = new p5.Vector(p1.x-p0.x,p1.y-p0.y);
              v01.setMag( v01.mag()*t );

          var pt = p5.Vector.add(p0,v01);
          
          fill(255,0,0);
          line(p0.x,p0.y,p1.x,p1.y);                // line p0 --> p1
          fill(255,0,0);circle(p0.x,p0.y,2*rPoint); // p0 point
          fill(255,0,0);circle(p1.x,p1.y,2*rPoint); // p1 point

          if(drawt){
             circle(pt.x,pt.y,rPoint);              // pt point
          };

          return pt
};



function pointDetection(p,r){

    if( mouseIsPressed)
          
      var boolDistance = sqrt((mouseX-p.x)**2+(mouseY-p.y)**2)<=5*r;

      if(boolDistance){

        var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,mouseX,mouseY);

          p.x = xGrid; //mouseX;
          p.y = yGrid; //mouseY;

          //  p.x = mouseX;
          //  p.y = mouseY;
          calcBezierArray([p0,p1,p2],t);
      }

};


function calcBezierArray(controlPoints,t){
    
    arrayBezier = [];

    for(let ti=0;ti<=t;ti+=tStep){
         
        var termP0 = controlPoints[0].copy();
        var termP1 = controlPoints[1].copy();
        var termP2 = controlPoints[2].copy();
          
            termP0.mult( (1-ti)**2  );
            termP1.mult( 2*(1-ti)*ti );
            termP2.mult( ti**2      );
        
        var bezierPoint = new p5.Vector(0,0);
            bezierPoint.add(termP0);
            bezierPoint.add(termP1);
            bezierPoint.add(termP2);
      
            arrayBezier.push(bezierPoint);
    };

    return arrayBezier
  
};

function plotBezierArray(arrayBezier){

         
  arrayBezier.forEach(point => {
    
    circle(point.x,point.y,rPoint/2)
  });


}



function listenSliders(){

  var sliderT = document.querySelector("#qs_1");

      sliderT.addEventListener('input',()=>{
        
        calcBezierArray([p0,p1,p2],t)
        

      });

};


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

};

