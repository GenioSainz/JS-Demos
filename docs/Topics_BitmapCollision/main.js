
// var canvas0 = new p(s0); // background image
// var canvas1 = new p(s1); // bitmap detection
// var canvas2 = new p(s2); // moving particles

var particle;
var r = 50;

var s0 = function( p ) {
          
          img = p.loadImage('../imgs/space.jpg');
          p.setup = function(){

                    p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                    p.image(img,0,0)
          };

          // p.draw = function() {
          // };
};

var s1 = function( p ) {
          
          p.setup = function(){

                p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                p.fill(0);p.noStroke();
                p.circle(p.windowWidth/2,p.windowHeight/2,2*r);
          };

          // p.draw = function() {
          // };
};

var s2  = function( p ) {
           
          var particle;
          p.setup = function() {
            
                p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                particle = {x:0,y:p.windowHeight/2,r:r/2}
                //particle = new Particle( {x:0,y:p.windowHeight} ,{v_m:,v_d:0},p);
          };

          p.draw = function() {

              p.clear();p.fill(0);
              p.circle(particle.x+=1,particle.y,particle.r);

              var imageData  = canvas1.drawingContext.getImageData(particle.x,particle.y,1,1).data;
              var pixelAlpha = imageData[3];
            
              if(pixelAlpha>0){

                canvas1.drawingContext.globalCompositeOperation = "destination-out";
			          canvas1.circle(particle.x,particle.y,20);
                particle.x = -200;

              };
            

          };
};

var canvas0 = new p5(s0); // background image
var canvas1 = new p5(s1); // bitmap detection
var canvas2 = new p5(s2); // moving particles


