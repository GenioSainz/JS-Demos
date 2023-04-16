

class Particle{

    // vector creation
    // new p5.Vector([x], [y], [z]);
    // new p5.Vector.fromAngle(angle, [length]);

    constructor(position, velocity, acceleration, radius){

        this.x    = position.x;                   // position x
        this.y    = position.y;                   // position y
        this.v_m  = velocity.v_m;                 // velocity module
        this.v_d  = velocity.v_d*Math.PI/180;     // velocity direction
        this.a_m  = acceleration.a_m;             // acceleration module
        this.a_d  = acceleration.a_d*Math.PI/180; // acceleration direction
        this.g    = 
        this.r    = radius.r;                     // particle radius
        this.path = [];
        this.pos  = new p5.Vector(this.x,this.y);
        this.vel  = new p5.Vector.fromAngle(this.v_d,this.v_m);
        this.ace  = new p5.Vector.fromAngle(this.a_d,this.a_m);
    
      };

      update(){

        this.pos = p5.Vector.add(this.pos,this.vel);
        this.vel = p5.Vector.add(this.vel,this.ace);
        this.path.push([this.pos.x,this.pos.y])

      };

      draw(){
             
        
        var position1,position2
        this.path.forEach((element, index)=>{
          
          position1 = this.path[index];
          position2 = this.path[index +1] || position1;
          //line(position1[0],position1[1],position2[0],position2[1])
          
          if(index==this.path.length-2){
            myUtils.drawArrow([position1[0],position1[1]],[position2[0],position2[1]],{module:50,color:[255,0,0]})
          }
        });
        
        circle(this.pos.x,this.pos.y,2*this.r);

      };

      static interpolate(p1,p2){

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
