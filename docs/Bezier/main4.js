
var gui;

var t     = 0.75;
var tMin  = 0;
var tMax  = 1;
var tStep = 0.01

var gridCellSize = 50;
var rPoint       = 8;

var p0,p1,p2,p3,p4;
var arrayBezier = [];
let dragging    = false; 

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    gui = createGui('Bezier').setPosition(gridCellSize/2,gridCellSize/2);
    gui.addGlobals('t');

    var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,windowWidth/2,windowHeight/2);

    // control points
    p0 = new p5.Vector(xGrid-4*gridCellSize,8*gridCellSize);
    p1 = new p5.Vector(xGrid-5*gridCellSize,4*gridCellSize);
    p2 = new p5.Vector(xGrid,2*gridCellSize);
    p3 = new p5.Vector(xGrid+5*gridCellSize,4*gridCellSize);
    p4 = new p5.Vector(xGrid+4*gridCellSize,8*gridCellSize);

    listenSliders();
    calcBezierArray([p0,p1,p2,p3,p4],t);

};

function draw() {
  
  background(240);strokeWeight(1);myUtils.drawGrid({cellSize:gridCellSize});textAlign(CENTER,CENTER)


  plotBezierArray(arrayBezier);strokeWeight(0.75);
  pointDetection(p0,rPoint);fill(0);text(`p0 (${Math.round(p0.x)},${Math.round(p0.y)})`,p0.x+6*rPoint,p0.y);
  pointDetection(p1,rPoint);fill(0);text(`p1 (${Math.round(p1.x)},${Math.round(p1.y)})`,p1.x+6*rPoint,p1.y);
  pointDetection(p2,rPoint);fill(0);text(`p2 (${Math.round(p2.x)},${Math.round(p2.y)})`,p2.x+6*rPoint,p2.y);
  pointDetection(p3,rPoint);fill(0);text(`p3 (${Math.round(p3.x)},${Math.round(p3.y)})`,p3.x+6*rPoint,p3.y);
  pointDetection(p4,rPoint);fill(0);text(`p4 (${Math.round(p4.x)},${Math.round(p4.y)})`,p4.x+6*rPoint,p4.y);

  
  // medium points
  var pt_01 = vector_p0p1t(p0,p1,t,rPoint); // pt_A                                        
  var pt_12 = vector_p0p1t(p1,p2,t,rPoint); // pt_B                                    
  var pt_23 = vector_p0p1t(p2,p3,t,rPoint); // pt_C           
  var pt_34 = vector_p0p1t(p3,p4,t,rPoint); // pt_D

  var pt_A = vector_p0p1t(pt_01,pt_12,t,rPoint,{color:[0,0,255], radius:rPoint/1.5});
  var pt_B = vector_p0p1t(pt_12,pt_23,t,rPoint,{color:[0,0,255], radius:rPoint/1.5});
  var pt_C = vector_p0p1t(pt_23,pt_34,t,rPoint,{color:[0,0,255], radius:rPoint/1.5});

  var pt_D = vector_p0p1t(pt_A,pt_B,t,rPoint,{color:[0,255,0], radius:rPoint/1.5});
  var pt_E = vector_p0p1t(pt_B,pt_C,t,rPoint,{color:[0,255,0], radius:rPoint/1.5});

  var pt_F = vector_p0p1t(pt_D,pt_E,t,rPoint,{ color:[255,0,255], radius:rPoint/1.5 ,drawt:true});


  if(t==0 || t==1){
    vector_p0p1t(p0,p1,t,rPoint);
    vector_p0p1t(p1,p2,t,rPoint);
    vector_p0p1t(p2,p3,t,rPoint);
    vector_p0p1t(p3,p4,t,rPoint);
  };


}


function vector_p0p1t(p0,p1,t,rPoint,{radius=rPoint,drawt=false,color=[255,0,0]}={}){
          
          /// v01 = p0 --> p1
          //   p1 = p0 + v01
          var v01 = new p5.Vector(p1.x-p0.x,p1.y-p0.y);
              v01.setMag( v01.mag()*t );

          var pt = p5.Vector.add(p0,v01);
          
          stroke(color);
          fill(color);line(p0.x,p0.y,p1.x,p1.y); 
          stroke(0)                                  // line p0 --> p1
          fill(color);circle(p0.x,p0.y,2*radius);    // p0 point
          fill(color);circle(p1.x,p1.y,2*radius);    // p1 point

          if(drawt){
             circle(pt.x,pt.y,radius);               // pt point
          };

          return pt
};



function pointDetection(p,r){

    if( mouseIsPressed){
          
      var boolDistance = sqrt((mouseX-p.x)**2+(mouseY-p.y)**2)<=5*r;

      if(boolDistance){

        var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,mouseX,mouseY);

          p.x = xGrid; //mouseX;
          p.y = yGrid; //mouseY;
          //  p.x = mouseX;
          //  p.y = mouseY;
          calcBezierArray([p0,p1,p2,p3,p4],t);
      }
    }

};


function calcBezierArray(controlPoints,t){
    
    arrayBezier = [];

    for(let ti=0;ti<=t;ti+=tStep){
         
        var termP0 = controlPoints[0].copy();
        var termP1 = controlPoints[1].copy();
        var termP2 = controlPoints[2].copy();
        var termP3 = controlPoints[3].copy();
        var termP4 = controlPoints[4].copy();
          
          
            termP0.mult( (1-ti)**4         );
            termP1.mult( 4*ti*(1-ti)**3    );
            termP2.mult( 6*(1-ti)**2*ti**2 );
            termP3.mult( 4*(1-ti)*ti**3    );
            termP4.mult( ti**4             );
        
        var bezierPoint = new p5.Vector(0,0);
            bezierPoint.add(termP0);
            bezierPoint.add(termP1);
            bezierPoint.add(termP2);
            bezierPoint.add(termP3);
            bezierPoint.add(termP4);
      
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
        
        calcBezierArray([p0,p1,p2,p3,p4],t)
        

      });

};


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);

};

function mouseReleased(){
  dragging = false;
}

