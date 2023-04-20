

class Particle{

    // vector creation
    // new p5.Vector([x], [y], [z]);
    // new p5.Vector.fromAngle(angle, [length]);

    constructor(position, velocity, acceleration,{radius=10,drawPath=true,drawParticle=true,pathPoints=50}={}){

        this.x    = position.x;                   // position x
        this.y    = position.y;                   // position y
        this.v_m  = velocity.v_m;                 // velocity module
        this.v_d  = velocity.v_d*Math.PI/180;     // velocity direction
        this.a_m  = acceleration.a_m;             // acceleration module
        this.a_d  = acceleration.a_d*Math.PI/180; // acceleration direction
        this.radius = radius;                      // particle radius
        this.pos    = new p5.Vector(this.x,this.y);
        this.vel    = new p5.Vector.fromAngle(this.v_d,this.v_m);
        this.ace    = new p5.Vector.fromAngle(this.a_d,this.a_m);
        this.path   = [];
        this.drawPath     = drawPath;
        this.drawParticle = drawParticle;
        this.pathPoints   = pathPoints;
    
      };

      update(){

        this.vel = p5.Vector.add(this.vel,this.ace);
        this.pos = p5.Vector.add(this.pos,this.vel);
        this.path.push([this.pos.x,this.pos.y])

      };

      draw(){
            
        
        var position1,position2
        var len  = this.path.length;

        // draw the last points of the particle's trajectory
        if(len>=this.pathPoints && this.drawPath){

            for(let i=len-this.pathPoints ;i<len;i++){

              position1 = this.path[i];
              position2 = this.path[i +1] || position1;
              push()
                strokeWeight(1.5);stroke(255,0,0);
                line(position1[0],position1[1],position2[0],position2[1]);
              pop()
            };
            
            // draw arrow = last position + velocity

            if(this.drawParticle){
                myUtils.drawArrow([position2[0],position2[1]],[position2[0]+this.vel.x,position2[1]+this.vel.y],{module:50,color:[255,0,0]});
            }

        }else if(len<this.pathPoints  && this.drawPath){

            for(let i=0;i<len;i++){

              position1 = this.path[i];
              position2 = this.path[i +1] || position1;
              push()
                strokeWeight(1.5);stroke(255,0,0);
                line(position1[0],position1[1],position2[0],position2[1]);
              pop()
            };

            // draw arrow = last position + velocity
            if(this.drawParticle){
                myUtils.drawArrow([position2[0],position2[1]],[position2[0]+this.vel.x,position2[1]+this.vel.y],{module:50,color:[255,0,0]});
            }

        }
        
        // draw particle
        if(this.drawParticle){
           circle(this.pos.x,this.pos.y,2*this.radius);
        };

      };

      static interpolate(p1,p2){

              // line between two particles
              line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y); 
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


class ParticleMass{

  // vector creation
  // new p5.Vector([x], [y], [z]);
  // new p5.Vector.fromAngle(angle, [length]);

  constructor(position, velocity, acceleration,{mass=1,radius=10,drawPath=true,drawParticle=true,pathPoints=50,arrowLen=50,color=[127,127,127]}={}){

      this.x    = position.x;                   // position x
      this.y    = position.y;                   // position y
      this.v_m  = velocity.v_m;                 // velocity module
      this.v_d  = velocity.v_d*Math.PI/180;     // velocity direction
      this.a_m  = acceleration.a_m;             // acceleration module
      this.a_d  = acceleration.a_d*Math.PI/180; // acceleration direction
      this.mass = mass

      this.pos  = new p5.Vector(this.x,this.y);
      this.vel  = new p5.Vector.fromAngle(this.v_d,this.v_m);
      this.ace  = new p5.Vector.fromAngle(this.a_d,this.a_m);

      this.path = [];
      this.drawPath     = drawPath;
      this.drawParticle = drawParticle;
      this.pathPoints   = pathPoints;
      this.radius = radius;                     // particle radius
      this.arrowLen     = arrowLen;
      this.color        = color;
  
    };

    update(){

      this.vel = p5.Vector.add(this.vel,this.ace);
      this.pos = p5.Vector.add(this.pos,this.vel);
      this.path.push([this.pos.x,this.pos.y])

    };

    draw(){
          
      
      var position1,position2
      var len  = this.path.length;

      // draw the last points of the particle's trajectory
      if(len>=this.pathPoints && this.drawPath){

          for(let i=len-this.pathPoints ;i<len;i++){

            position1 = this.path[i];
            position2 = this.path[i +1] || position1;
            push()
              strokeWeight(1.5);stroke(255,0,0);
              line(position1[0],position1[1],position2[0],position2[1]);
            pop()
          };
          
          // draw arrow = last position + velocity

          if(this.drawParticle){
              myUtils.drawArrow([position2[0],position2[1]],[position2[0]+this.vel.x,position2[1]+this.vel.y],{module:this.arrowLen,color:[255,0,0]});
          }                                                                                                          

      }else if(len<this.pathPoints  && this.drawPath){

          for(let i=0;i<len;i++){

            position1 = this.path[i];
            position2 = this.path[i +1] || position1;
            push()
              strokeWeight(1.5);stroke(255,0,0);
              line(position1[0],position1[1],position2[0],position2[1]);
            pop()
          };

          // draw arrow = last position + velocity
          if(this.drawParticle){
              myUtils.drawArrow([position2[0],position2[1]],[position2[0]+this.vel.x,position2[1]+this.vel.y],{module:this.arrowLen,color:[255,0,0]});
          }

      }
      
      // draw particle
      if(this.drawParticle){
         fill(this.color);
         circle(this.pos.x,this.pos.y,2*this.radius);
      };

    };

    static interpolate(p1,p2){

         // line between two particles
         line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y); 
    };

    angleTo(p2){
           
         return  atan2(p2.y-this.pos.y,p2.x-this.pos.x)

    };

    distanceTo(p2){
          
         return Math.sqrt( (p2.x-this.pos.x)**2 + (p2.y-this.pos.y)**2)
    };

    gravityTo(p2){
      
         var distance    = this.distanceTo(p2);
         var gravityMood = (this.mass*p2.mass)/distance**2;
         var anglep1p2   = this.angleTo(p2)*PI/180;
         var gravityVec  = new p5.Vector.fromAngle(anglep1p2,gravityMood);

         // UPDATE
         this.vel        = p5.Vector.add(gravityVec,this.vel);
         this.pos        = p5.Vector.add(this.pos,this.vel);
         this.path.push([this.pos.x,this.pos.y])
    }

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