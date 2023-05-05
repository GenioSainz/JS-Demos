
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

      var point = this.pointsArray[i];
          point.r    = this.radius;
          point.drag = false;


    };

  }

  createRandom(){

      for(let i=0;i<this.nPoints;i++){
        
        var pointX     = random( this.dxyLimits, windowWidth  - this.dxyLimits );
        var pointY     = random( this.dxyLimits, windowHeight - this.dxyLimits );

        var point         = new p5.Vector( pointX, pointY);
            point.r       = random(30,40);
            point.drag    = false;
            point.offsetX = 0;
            point.offsetY = 0;

        this.pointsArray.push( point )

      };    
  };

  mouseDetection(){

      if( mouseIsPressed && !this.dragMode){
            
            for(let i=0;i<this.nPoints;i++){

                  var point        = this.pointsArray[i];
                  var boolDistance = sqrt((mouseX-point.x)**2+(mouseY-point.y)**2)<=point.r;

                  if(boolDistance){

                      this.dragMode = true;
                      point.drag    = true;
                      point.offsetX = mouseX-point.x;
                      point.offsetY = mouseY-point.y;
                      break
                  };
            };
      };
  };

  draw(){
      
      fill(255,0,0)
      for(let i=0;i<this.nPoints;i++){
        
          var point = this.pointsArray[i];
    
          if(point.drag){

            point.x = mouseX-point.offsetX;
            point.y = mouseY-point.offsetY;
            
            push()
             drawingContext.shadowOffsetX = 10;
             drawingContext.shadowOffsetY = 10;
             drawingContext.shadowBlur    = 10;
             drawingContext.shadowColor   = 'gray';
             fill(255,0,0);circle(        point.x              , point.y  ,2*point.r);
             fill(0,0,0)  ; text(`p${i}`, point.x + 1.5*point.r, point.y);
            pop()
    
          }else{
    
            fill(255,0,0);circle(point.x,point.y,2*point.r);
            fill(0,0,0)  ;text(`p${i}`,point.x+1.5*point.r,point.y);
    
          };
      };
  
  };

  pressUp(){

      for(let i=0;i<this.nPoints;i++){
      
          var point  = this.pointsArray[i];
          point.drag = false;
      };
  
      this.dragMode = false;
  };

  addPoint(pointX, pointY){

    var point      = new p5.Vector( pointX, pointY);
        point.r    = this.radius;;
        point.drag = false;
        
        this.pointsArray.push(point);
        this.nPoints+=1;
  };



};




