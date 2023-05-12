

var t     = 0.75;
var tMin  = 0;
var tMax  = 1;
var tStep = 0.01

let controlPoints;
let bezierLevels = [];
let bezierPoints = [];
let colorArray   = [];
var pc0,pc1,pc2,pc3,pc4;

var CasteljauAnimation = true;
var roundCoordinates   = false
var gridCellSize       = 50;
var rPoint             = 8;
var gui;


function setup() {
    
  frameRate(20)
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    gui = createGui('Bezier Curve').setPosition(gridCellSize/2,gridCellSize/2);
    gui.addGlobals('t','CasteljauAnimation','roundCoordinates');

    var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,windowWidth/2,windowHeight/2);

    // initial control points
    pc0 = new p5.Vector(xGrid-4*gridCellSize,8*gridCellSize);
    pc1 = new p5.Vector(xGrid-5*gridCellSize,4*gridCellSize);
    pc2 = new p5.Vector(xGrid,2*gridCellSize);
    pc3 = new p5.Vector(xGrid+5*gridCellSize,4*gridCellSize);
    pc4 = new p5.Vector(xGrid+4*gridCellSize,8*gridCellSize);
    
    controlPoints = new pointsDetection({radius:rPoint});
    controlPoints.readPoints([pc0,pc1,pc2,pc3,pc4]);

    getColors();
    listenSliders();
    calcBezierCurve();
   
};

function draw() {
  
  background(255);strokeWeight(1);myUtils.drawGrid({cellSize:gridCellSize});textAlign(CENTER,CENTER)

  strokeWeight(0.75);

  controlPoints.mouseDetection();
  controlPoints.drawDetection(roundCoordinates);
  
  plotBezierCurve();
  calcDrawBezierAllLevels();

  if(t==0 || t==1){
      
    drawBezierOnly0Level();
    
  };

};

function vector_p0p1t(p0,p1,t,rPoint,{radius=rPoint,drawPointT=false,color=[255,0,0]}={}){
          
          /// v01 = p0 --> p1
          //   p1 = p0 + v01
          var v01 = new p5.Vector(p1.x-p0.x,p1.y-p0.y);
              v01.setMag( v01.mag()*t );

          var pt = p5.Vector.add(p0,v01);
          
          stroke(color);strokeWeight(2)
          line(p0.x,p0.y,p1.x,p1.y); // line p0 --> p1

          stroke(0);fill(color);strokeWeight(1)                                
          circle(p0.x,p0.y,radius); // p0 point
          circle(p1.x,p1.y,radius); // p1 point

          if(drawPointT){
             circle(pt.x,pt.y,radius/2); // pt point point beetwen p0,p1 (x,y)=f(t)
          };

          return pt
};

function calcDrawBezierAllLevels(){
  
   // var degree          = 4;
   //     bezierLevels[0] = myUtils.linspace(0,degree,degree+1)

   // degree=4; nPoints=5 
   // p0 p1 p2 p3 p4  0 vector_p0p1t() A,B,C,D
   //   A  B  C  D    1 vector_p0p1t() E,F,G
   //     E  F  G     2 vector_p0p1t() H,I
   //      H   I      3 vector_p0p1t() J
   //        J        4

    bezierLevels    = [];
    bezierLevels[0] = controlPoints.pointsArray;
    
    if(CasteljauAnimation){ 
         var N = bezierLevels[0].length-1;
    }else{
         var N = 1;
    };

    for(let i=0; i<N ;i++){   

        var level = []
        var n     = bezierLevels[i].length-1;

        for (let j=0;j<n;j++){
            
           var p00 = bezierLevels[i][j];
           var p11 = bezierLevels[i][j+1]
           var p01;
           if(i==0){
                    p01 = vector_p0p1t(p00,p11,t,10,{color:colorArray[i],radius:2*rPoint});

           }else if(i>0 && i<N-1){

                    p01 = vector_p0p1t(p00,p11,t,10,{color:colorArray[i],radius:1.5*rPoint});
           }else{
                    p01 = vector_p0p1t(p00,p11,t,10,{color:colorArray[i],drawPointT:true,radius:1.5*rPoint});
           };
    
            level.push ( p01 );
        };

        bezierLevels.push(level);
    };
};

function drawBezierOnly0Level(){
  
       var n     = bezierLevels[0].length-1;

       for (let j=0;j<n;j++){
           
          var p00 = bezierLevels[0][j];
          var p11 = bezierLevels[0][j+1]
          vector_p0p1t(p00,p11,t,10,{color:colorArray[0],radius:2*rPoint});
       };
};

function calcDistances(x,y){
          
         var distances      = [];
         var distancesSort  = [];
         var distancesIndex = [];

         for(let i=0; i<controlPoints.pointsArray.length; i++){
             
            var dx = controlPoints.pointsArray[i].x - x;
            var dy = controlPoints.pointsArray[i].y - y;

            distances.push( sqrt( dx**2 + dy**2) );
         };

         distancesIndex = [];
         distancesSort  = distances.toSorted((a, b) => a - b)
         distancesSort.forEach( d => {

              distancesIndex.push(  distances.indexOf(d) );
         }); 

         return min( distancesIndex[0], distancesIndex[1] );

};


function calcBezierCurve(){
    
    bezierPoints = [];
    var npoints  = controlPoints.pointsArray.length;
    var n        = npoints - 1;

    for(let ti=0;ti<=t;ti+=tStep){

        var tiValue = new p5.Vector(0,0);

        for(let i=0; i<npoints; i++){
            
                var point_i   = controlPoints.pointsArray[i].copy();
                var binomial  = factorialize(n)/( factorialize(i)*factorialize(n-i));
                var pointTerm = binomial*(ti**i)*(1-ti)**(n-i);
                
                point_i.mult( pointTerm );
                tiValue.add(  point_i  );      
        };

        bezierPoints.push(tiValue);
    };

};

function plotBezierCurve(){

    bezierPoints.forEach(point => {
      
      fill(255,0,0);circle(point.x,point.y,rPoint/2)
    });

};

function listenSliders(){

  var sliderT = document.querySelector("#qs_1");

      sliderT.addEventListener('input',()=>{

         calcBezierCurve()
      });
};


function mouseDragged(){
  
   calcBezierCurve();
};

function doubleClicked(event) {
    
    if(keyIsPressed){
        var index = calcDistances(event.x,event.y);
        controlPoints.addPointIndex(event.x,event.y,index+1);
        calcBezierCurve();
    };
};

function mouseReleased(){
         
    controlPoints.pressUp();
};

function windowResized(){
  
    resizeCanvas(windowWidth, windowHeight);
};

function factorialize(num){

      if (num === 0 || num === 1)
        return 1;
      for (var i = num - 1; i >= 1; i--) {
        num *= i;
      }
      return num;
};

function getColors(){
         
         colorArray = ['red',
                       'green',
                       'blue',
                       'fuchsia',
                       'lime',
                       'gold',
                       'skyblue']
};