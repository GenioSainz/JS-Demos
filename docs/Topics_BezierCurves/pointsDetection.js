
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

  createRandom(){

      for(let i=0;i<this.nPoints;i++){
        
        var pointX     = random( this.dxyLimits, windowWidth  - this.dxyLimits );
        var pointY     = random( this.dxyLimits, windowHeight - this.dxyLimits );

        var point      = new p5.Vector( pointX, pointY);
            point.r    = random(10,20);
            point.drag = false;

        this.pointsArray.push( point )

      };    
  };

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
    
                // fill(255,0,0);circle(mouseX,mouseY,2*point.r);
                //fill(0);text(`p${i}`,mouseX + 3*point.r, mouseY);
            
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
    
            //fill(255,0,0);circle(point.x,point.y,2*point.r);
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




