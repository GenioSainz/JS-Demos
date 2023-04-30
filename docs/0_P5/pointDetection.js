

let controlPoints   = [];
let nControlPoints  = 10;
let rPoint          = 10;
let gridCellSize    = 50;
let dragMode        = false


function setup() {

  createCanvas(windowWidth, windowHeight);textAlign(CENTER,CENTER);textSize(12)
  
  for(i=0;i<nControlPoints;i++){
       
       var pointX = random(gridCellSize ,windowWidth-gridCellSize  );
       var pointY = random(gridCellSize ,windowHeight-gridCellSize );

       var point      = new p5.Vector( pointX, pointY);
           point.r    = random(10,20);
           point.drag = false;

       controlPoints.push( point )
  }; 

};

function draw() {
  
  background(240);strokeWeight(2);noFill()
  
  myUtils.drawGrid({cellSize:gridCellSize});

  drawArray();
  pointArrayDetection();

}

function drawArray(){

  for(i=0;i<nControlPoints;i++){
    
      var point = controlPoints[i];

      if(point.drag){

        fill(255,0,0); circle(mouseX,mouseY,2*point.r);
        fill(0);       text(`p${i}`,mouseX, mouseY-2*point.r);
        
        point.x = mouseX;
        point.y = mouseY;

      }else{

        fill(255,0,0); circle(point.x,point.y,2*point.r);
        fill(0);       text(`p${i}`,point.x,point.y-2*point.r)

      }
  };

};

function pointArrayDetection(){

    if( mouseIsPressed && !dragMode){
          
          for(i=0;i<nControlPoints;i++){

                var point        = controlPoints[i];
                var boolDistance = sqrt((mouseX-point.x)**2+(mouseY-point.y)**2)<=point.r;

                if(boolDistance){

                    point.drag = true;
                    dragMode   = true;

                    break
                };
          };
    };
};

function mouseReleased(){

  for(i=0;i<nControlPoints;i++){
    
      var point  = controlPoints[i];
      point.drag = false;
  };

  dragMode = false;
};


function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}