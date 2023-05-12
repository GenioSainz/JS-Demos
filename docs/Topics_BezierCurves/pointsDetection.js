
class pointsDetection{

  constructor({nPoints=20,dxyLimits=50,radius=10}={}){

      this.pointsArray = [];
      this.nPoints     = nPoints;
      this.dragMode    = false; 
      this.dxyLimits   = dxyLimits; 
      this.radius      = radius;
  };

  readPoints(array){
    
    this.pointsArray = array;
    this.nPoints     = array.length;
    for(let i=0;i<this.nPoints;i++){

      var point      = this.pointsArray[i];
          point.r    = this.radius;
          point.drag = false;

    };

  }

  mouseDetection(){

      if( mouseIsPressed && !this.dragMode){
            
            for(let i=0;i<this.nPoints;i++){

                  var point        = this.pointsArray[i];
                  var boolDistance = sqrt((mouseX-point.x)**2+(mouseY-point.y)**2)<=point.r;

                  if(boolDistance){

                      point.drag    = true;
                      this.dragMode = true;

                      break
                  };
            };
      };
  };

  drawDetection(RoundCoordinates){
      
      fill(255,0,0)
      for(let i=0;i<this.nPoints;i++){
        
          var point = this.pointsArray[i];
    
          if(point.drag){
    
                if(RoundCoordinates){

                  var {xGrid,yGrid} = myUtils.roundGrid(gridCellSize,mouseX,mouseY);
                  point.x = xGrid;
                  point.y = yGrid;
                  fill(0);(`p${i}`,xGrid + 3*point.r, yGrid);

                }else{
                  point.x = mouseX;
                  point.y = mouseY;
                  fill(0);text(`p${i}`,mouseX + 3*point.r, mouseY);
                }
    
          }else{

            fill(0);text(`p${i}`,point.x+3*point.r,point.y);
    
          };
      };
  
  };

  addPointIndex(pointX, pointY, index){

      var point      = new p5.Vector( pointX, pointY);
          point.r    = this.radius;;
          point.drag = false;
          
          this.pointsArray.splice(index, 0, point);;
          this.nPoints+=1;
  };

  pressUp(){

      for(let i=0;i<this.nPoints;i++){
      
          var point  = this.pointsArray[i];
          point.drag = false;
      };
  
          this.dragMode = false;
      };

};







// function addPoint(){

//   var pointX = random(gridCellSize, windowWidth  - gridCellSize );
//   var pointY = random(gridCellSize, windowHeight - gridCellSize );

//   var point      = new p5.Vector( pointX, pointY);
//       point.r    = random(10,20);
//       point.drag = false;

//       controlPoints.push(point);
//       nControlPoints+=1;

// }




