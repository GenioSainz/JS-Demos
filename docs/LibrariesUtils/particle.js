
 
class Particle{

  // vector creation
  // new p5.Vector([x], [y], [z]);
  // new p5.Vector.fromAngle(angle, [length]);

  constructor(position, velocity, gravity,{mass=1,radius=20,vfriction=0.99,kd=0.1,k=0.1,c=0.1,
                                                color=[127,127,127],
                                                drawPath=false,pathPoints=50,pathColor=[255,0,0],
                                                drawParticle=true,
                                                drawArrow=true,arrowLen=50,arrowColor=[255,0,0]}={}){

      this.x       = position.x;                   // position x
      this.y       = position.y;                   // position y
      this.v_m     = velocity.v_m;                 // velocity module
      this.v_d     = velocity.v_d*Math.PI/180;     // velocity direction
      this.mass    = mass;                         // mass
      this.radius  = radius;                       // particle radius
      
      this.vfriction = vfriction;
      this.kd        = kd;                           // drag coefficient
      this.k         = k;                            // spring cte
      this.c         = c;                            // damping force
      this.color     = color;

      this.pos     = new p5.Vector(this.x,this.y);               // position     vector
      this.vel     = new p5.Vector.fromAngle(this.v_d,this.v_m); // velocity     vector
      this.ace     = new p5.Vector.fromAngle(0,0);               // aceletation  vector
      this.gravity = new p5.Vector.fromAngle(PI/2,gravity.g);    // gravity      vector
     
      this.path         = [];
      this.drawPath     = drawPath;
      this.pathPoints   = pathPoints;
      this.pathColor    = pathColor;
      
      this.drawParticle = drawParticle;

      this.drawArrow    = drawArrow;
      this.arrowLen     = arrowLen;
      this.arrowColor   = arrowColor
  
    };

    update(){

      this.vel = p5.Vector.add(this.vel,this.ace);
      this.vel.mult(this.vfriction);
      this.pos = p5.Vector.add(this.pos,this.vel);

    };

    applyForces(array){
    
        var x = 0;
        var y = 0;
        array.forEach( (vector) => {
                        x+= vector.x;
                        y+= vector.y;
        });       
        
        this.ace = new p5.Vector(x,y);
     }

    dragForce(){
        
        // F = - kd*v**2
        var dragModule = this.kd*this.vel.mag()**2;
        var dragVector = this.vel.copy();
            dragVector.normalize();
            dragVector.mult(-dragModule);

        return dragVector;
    };

    
    springForce(springX,springY,springLength=100){

      // springTO point (springX,springY)---springLength---particle
      // F = -k*x - c*v
      var springVector  = new p5.Vector((springX-this.pos.x),(springY-this.pos.y));
          springVector.setMag(springVector.mag()-springLength);

      var springModule  = this.k*springVector.mag();
      var dampingModule = this.c*this.vel.mag();
      
          springVector.normalize();
          springVector.mult( springModule + dampingModule );

     return springVector

    };

    static spring(p1,p2,separation){
           
      var springVector  = new p5.Vector((p1.pos.x-p2.pos.x),(p1.pos.y-p2.pos.y));
          springVector.setMag(springVector.mag()-separation);

      var springModule  = p1.k*springVector.mag();
      var dampingModule = p1.c*p1.vel.mag();
  
      springVector.normalize();
      springVector.mult( springModule + dampingModule );

      return springVector;

    }

    angleTo(p2){
           
         return  atan2(p2.y-this.pos.y,p2.x-this.pos.x)

    };

    distanceTo(p2){
          
         return Math.sqrt( (p2.pos.x-this.pos.x)**2 + (p2.pos.y-this.pos.y)**2)
    };

    gravityTo(p2){
      
         var distance    = this.distanceTo(p2);
         var gravityMood = (this.mass*p2.mass)/distance**2;
         var anglep1p2   = this.angleTo(p2)*PI/180;
         var gravityVec  = new p5.Vector.fromAngle(anglep1p2,gravityMood);
          
         return gravityVec;
    }

    draw(){

      // draw path
      if(this.drawPath){

         // draw the last pathPoints of the particle's trajector [........len-this.pathPoints.......len]
            
          this.path.push([this.pos.x,this.pos.y]);
          
          var position1,position2
          var len  = this.path.length;
  
          for(let i=len-this.pathPoints;i<len;i++){
    
            position1 = this.path[i]    || NaN;
            position2 = this.path[i +1] || NaN;
            push()
              strokeWeight(1.5);stroke(this.pathColor);
              line(position1[0],position1[1],position2[0],position2[1]);
            pop()
          };
      };
      
      // draw particle
      if(this.drawParticle){

        fill(this.color);
        circle(this.pos.x,this.pos.y,2*this.radius);
      };

      // draw arrow
      if(this.drawArrow){

        myUtils.drawArrow([this.pos.x,this.pos.y],[this.pos.x+this.vel.x,this.pos.y+this.vel.y],{module:this.arrowLen,color:this.arrowColor});
      };

    };

    checkEdgesBounceCentroid(){

      // if( this.pos.y<0 || this.pos.y>windowHeight ){ this.vel.y =  -this.vel.y };
      // if( this.pos.x<0 || this.pos.x>windowWidth  ){ this.vel.x =  -this.vel.x };

      if( this.pos.y<0 ){
        
        this.pos.y =  0;
        this.vel.y = -this.vel.y;

      }else if( this.pos.y>windowHeight ){
        
        this.pos.y = windowHeight;
        this.vel.y = -this.vel.y;
        
      }else if(this.pos.x<0 ){

        this.pos.x =  0
        this.vel.x = -this.vel.x;

      }else if(this.pos.x>windowWidth){

        this.pos.x = windowWidth
        this.vel.x = -this.vel.x;     
      };

    };

    checkEdgesBounceRadius(){

      if( this.pos.y-this.radius<0 ){
        
        this.pos.y =   this.radius;
        this.vel.y =  -this.vel.y;

      }else if( this.pos.y+this.radius>windowHeight ){
        
        this.pos.y =  windowHeight-this.radius;
        this.vel.y =  -this.vel.y;
        
      }else if(this.pos.x-this.radius<0 ){

        this.pos.x = this.radius
        this.vel.x = -this.vel.x;

      }else if(this.pos.x+this.radius>windowWidth){

        this.pos.x = windowWidth-this.radius
        this.vel.x =  -this.vel.x;     
      };

    };

    checkEdgesWrap(){

      if( this.pos.y-this.radius>windowHeight ){

        this.pos.y = -this.radius;

      }else if( this.pos.y+this.radius<0 ){

        this.pos.y = windowHeight-this.radius;
        
      }else if(this.pos.x-this.radius>windowWidth ){
        
        this.pos.x = -this.radius;

      }else if(this.pos.x+this.radius<0){

        this.pos.x = windowWidth-this.radius;    
      };

    };
    
    static particleDetection(particle){
    
      if( mouseIsPressed){
       
           var boolDistance = sqrt((mouseX-particle.pos.x)**2+(mouseY-particle.pos.y)**2)<=particle.radius;

           if(boolDistance){
                particle.pos.x  = mouseX;
                particle.pos.y  = mouseY;
           };
      };
    };



    // get/set pos
    get pos(){
      return this._pos
    };
    set pos(newVector){
      this._pos = newVector;
    };

    // get/set vel
    get vel(){
      return this._vel
    };
    set vel(newVector){
      this._vel = newVector;
    };

    // get/set ace
    get ace(){
      return this._ace
    };
    set ace(newVector){
      this._ace = newVector;
    };

};