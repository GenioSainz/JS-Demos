

var xRadius,yRadius;
var xSpeed,ySpeed;
var xCenter,yCenter;
var xyArr=[];
var gui;
var x,y;

var xRadiusStep = 50;
var xRadiusMin  = 50;
var xRadiusMax  = 400;
var xRadius     = 150;

var yRadiusStep = 50;
var yRadiusMin  = 50;
var yRadiusMax  = 400;
var yRadius     = 150;

var xSpeedStep = 1;
var xSpeedMin  = 1;
var xSpeedMax  = 10;
var xSpeed     = 5;

var ySpeedStep = 1;
var ySpeedMin  = 1;
var ySpeedMax  = 10;
var ySpeed     = 7;

var xPhaseStep = 45;
var xPhaseMin  = 0;
var xPhaseMax  = 360;
var xPhase     = 0;

var yPhaseStep = 45;
var yPhaseMin  = 0;
var yPhaseMax  = 360;
var yPhase     = 0;

var frameSpeedSteep = 5 ;
var frameSpeedMin   = 1;
var frameSpeedMax   = 60;
var frameSpeed      = 30;

var gridCellSize = 50;
var pathPoints   = 500;



function setup() {
   
  createCanvas(windowWidth,windowHeight);
  frameRate(frameSpeed);rectMode(CENTER);
  
  xCenter = Math.round(0.5*windowWidth/gridCellSize)*gridCellSize;
  yCenter = Math.round(0.5*windowHeight/gridCellSize)*gridCellSize;
   
  
  gui = createGui('Lissajous Curve').setPosition(gridCellSize/2,gridCellSize/2);
  gui.addGlobals('xRadius','yRadius','xSpeed','ySpeed','delta','xPhase','yPhase','frameSpeed');

  listenSliders()
  lissajous();
}

function draw() {
  
  frameRate(frameSpeed);

  background(240);
  myUtils.drawGrid({cellSize:gridCellSize});
  
  noFill();strokeWeight(0);rect(xCenter,yCenter,2*xRadius,2*yRadius)

  // draw curve
  stroke(255,0,0);strokeWeight(2)
  xyArr.forEach((xy,index)=>{

        var position1 = xyArr[index  ] || NaN;
        var position2 = xyArr[index+1] || NaN;
        line(position1[0],position1[1],position2[0],position2[1]);
        
  });

  // (Xcoor,Ycoor)
  var cicle = frameCount%pathPoints
  var xCoor = xyArr[cicle][0];
  var yCoor = xyArr[cicle][1];

  // draw STATIC Xline
  var xLine_y    = yCenter - yRadius - gridCellSize;
  var xLine_xMin = xCenter - xRadius;
  var xLine_xMax = xCenter + xRadius;
  strokeWeight(2);stroke(255,0,255);line(xLine_xMin ,xLine_y ,xLine_xMax ,xLine_y );
 

  // draw STATIC  Yline
  var yLine_x    = xCenter - xRadius - gridCellSize;
  var yLine_yMin = yCenter - yRadius;
  var yLine_yMax = yCenter + yRadius;
  strokeWeight(2);stroke(0,0,255);line(yLine_x ,yLine_yMin,yLine_x ,yLine_yMax);

  // draw DYNAMIC Xline
  strokeWeight(1);stroke(0);line(xCoor, yCoor, xCoor, xLine_y);
  fill(255,0,255);circle(xCoor, xLine_y, 20);

  // draw DYNAMIC Yline
  strokeWeight(1);line(xCoor, yCoor, yLine_x, yCoor);
  fill(0,0,255);  circle(yLine_x, yCoor, 20);



  stroke(0);fill(255,0,0)
  line(xCenter,yCenter,xCoor,yCoor)
  circle(xCoor,yCoor,20);


  
};

function lissajous(){
  
  // var phaseTxt = ['0','PI/4','PI/2','3*PI/4','PI'];
  // var phaseNum = [0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI];
  // var index    = phaseTxt.indexOf(delta);
  // var phase    = phaseNum[index];

  xyArr   = []
  for(let i=0;i<=1;i+=1/pathPoints){
    
    var thetai = lerp(0,2*PI,i);
    var xCoord = xCenter + xRadius*sin( xSpeed*thetai + xPhase*Math.PI/180);
    var yCoord = yCenter + yRadius*cos( ySpeed*thetai + yPhase*Math.PI/180);
    xyArr.push( [xCoord, yCoord] );

  };

  xyArr.push(xyArr[0]);

}


function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
  xCenter = Math.round(0.5*windowWidth/gridCellSize)*gridCellSize;
  yCenter = Math.round(0.5*windowHeight/gridCellSize)*gridCellSize;
  
  lissajous();

};

function listenSliders(){

 
  var slider_xR = document.querySelector("#qs_1");
  var slider_yR = document.querySelector("#qs_2");
  var slider_xW = document.querySelector("#qs_3");
  var slider_yW = document.querySelector("#qs_4");
  var slider_xP = document.querySelector("#qs_5");
  var slider_yP = document.querySelector("#qs_6");
      
  slider_xR.addEventListener('input',()=>{
    lissajous();
  });
      
  slider_yR.addEventListener('input',()=>{
    lissajous();
  });

  slider_xW.addEventListener('input',()=>{
    lissajous();
  });
      
  slider_yW.addEventListener('input',()=>{
    lissajous();
  });

  slider_xP.addEventListener('input',()=>{
    lissajous();
  });
      
  slider_yP.addEventListener('input',()=>{
    lissajous();
  });
}


// GUI COLORS
var collection
setTimeout(()=>{
  collection = document.querySelectorAll("div.qs_label");
  
  collection[2].style.color='rgb(255,0,255)';
  collection[3].style.color='rgb(0,0,255)';
},500)





