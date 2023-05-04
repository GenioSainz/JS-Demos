
 
class Particle{

  // vector creation
  // new p5.Vector([x], [y], [z]);
  // new p5.Vector.fromAngle(angle, [length]);

  constructor(position, velocity, pObj,{radius=20,color=[0,0,0],}={}){
      this.p       = pObj                          // p5 object
      this.x       = position.x;                   // position x
      this.y       = position.y;                   // position y
      this.v_m     = velocity.v_m;                 // velocity module
      this.v_d     = velocity.v_d*Math.PI/180;     // velocity direction
      this.radius  = radius;                       // particle radius
      this.color   = color;
      
      this.vx  = this.v_m*Math.cos( this.v_d);
      this.vy  = this.v_m*Math.sin( this.v_d);
      this.vel = this.p.createVector(this.vx,this.vy); // velocity     vector
      this.pos = this.p.createVector(this.x,this.y);  // position     vector
    };

    update(){

      this.pos = this.p.createVector(this.pos.x+this.vel.x,this.pos.y+this.vel.y); //add(this.pos,this.vel);

    };

    draw(){


        this.p.noStroke();
        this.p.fill(this.color);
        this.p.circle(this.pos.x,this.pos.y,2*this.radius);

    };

    returnToXY(x,y){

         var boolX = this.pos.x > this.p.windowWidth  || this.pos.X <0 ;
         var boolY = this.pos.y > this.p.windowHeight || this.pos.y <0 ;

        if( boolX || boolY ){

            this.pos.x = x;
            this.pos.y = y;
             
            var m  = this.p.random(2,4);
            var d  = this.p.random(-15,15)*Math.PI/180;
            var vx = m*Math.cos( d );
            var vy = m*Math.sin( d );
            this.vel = this.p.createVector(vx,vy);

        };

    };



    checkEdgesBounceCentroid(){

      // if( this.pos.y<0 || this.pos.y>windowHeight ){ this.vel.y =  -this.vel.y };
      // if( this.pos.x<0 || this.pos.x>windowWidth  ){ this.vel.x =  -this.vel.x };

      if( this.pos.y<0 ){
        
        this.pos.y =  0;
        this.vel.y = -this.vel.y;

      }else if( this.pos.y> this.p.windowHeight ){
        
        this.pos.y = this.p.windowHeight;
        this.vel.y = -this.vel.y;
        
      }else if(this.pos.x<0 ){

        this.pos.x =  0
        this.vel.x = -this.vel.x;

      }else if(this.pos.x>this.p.windowWidth){

        this.pos.x = this.p.windowWidth
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