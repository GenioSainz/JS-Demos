
 
class Particle{

  // vector creation
  // new p5.Vector([x], [y], [z]);
  // new p5.Vector.fromAngle(angle, [length]);

  constructor(position, velocity,{radius=20,color=[127,127,127],}={}){

      this.x       = position.x;                   // position x
      this.y       = position.y;                   // position y
      this.v_m     = velocity.v_m;                 // velocity module
      this.v_d     = velocity.v_d*Math.PI/180;     // velocity direction
      this.radius  = radius;                       // particle radius
      this.color   = color;
      this.pos     = new p55.Vector(this.x,this.y);               // position     vector
      this.vel     = new p55.Vector.fromAngle(this.v_d,this.v_m); // velocity     vector
      this.ace     = new p55.Vector.fromAngle(0,0);               // aceletation  vector
      this.gravity = new p55.Vector.fromAngle(PI/2,gravity.g);    // gravity      vector
     
  
    };

    update(){

      this.vel = p55.Vector.add(this.vel,this.ace);
      this.pos = p55.Vector.add(this.pos,this.vel);

    };

    draw(){

        fill(this.color);
        circle(this.pos.x,this.pos.y,2*this.radius);

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