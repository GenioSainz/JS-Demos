
// var canvas0 = new p(s0); // background image
// var canvas1 = new p(s1); // bitmap detection
// var canvas2 = new p(s2); // moving particles

var nParticles = 100;
var R = 100;
var r = 5;

var s0 = function( p ) {
          
          img = p.loadImage('../imgs/space.jpg');
          p.setup = function(){

                    p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                    p.image(img,0,0)
          };

          // p.draw = function() {
          // };

          p.windowResized = function(){
            window.location.reload()
          }

};

var s1 = function( p ) {
          
          p.setup = function(){

                p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                p.fill(0);p.noStroke();
                p.circle(p.windowWidth/2,p.windowHeight/2,2*R);
                //p.rectMode(p.CENTER)
                //p.rect(p.windowWidth/2,p.windowHeight/2,2*R,2*R)
          };

          // p.draw = function() {
          // };
};

var s2  = function( p ) {
           
          var particleArray  = [];
          var nCollisions    = 0;
          var particle;
          var initialPixels   = 0; // initial circle
          var ratioCollisions = 1;
          var xmin = p.windowWidth/2-R;
          var ymin = p.windowHeight/2-R;

          p.setup = function() {
            
                  p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                  p.textSize(18)
                  
                  for(let i=0;i<nParticles;i++){
                        particleArray.push( new Particle( {x:0,y:p.windowHeight/2} ,{v_m:p.random(2,4),v_d:p.random(-5,5)}, p, {radius:r,color:[0,0,0]} ) );
                  };
                  
                  initialPixels  = p.ratioCollision().colPixels;
                  
                  setInterval(()=>{

                        ratioCollisions =  p.ratioCollision().colPixels / initialPixels;

                  },1000)
          };

          p.draw = function() {
            
                  p.clear();
                  p.noFill();p.stroke(0)
                  p.circle(p.windowWidth/2,p.windowHeight/2,2*R)

                  p.fill(255);
                  p.text(`Collision Area: ${(100*ratioCollisions).toFixed(2)} %`,p.windowWidth/2,20);
                  p.text(`No. Collisions: ${nCollisions}`                        ,p.windowWidth/2,40);

                  for(let i=0;i<nParticles;i++){
                        
                        particle = particleArray[i];
            
                        particle.returnToXY(0,p.windowHeight/2)
                        particle.draw();
                        particle.update();
                        
                        var xp = particle.pos.x;
                        var yp = particle.pos.y;
                        
                        var  pixelAlphaN = canvas1.drawingContext.getImageData(xp  , yp-r, 1,1).data[3] > 0;
                        var  pixelAlphaS = canvas1.drawingContext.getImageData(xp  , yp+r, 1,1).data[3] > 0;
                        var  pixelAlphaE = canvas1.drawingContext.getImageData(xp+r, yp  , 1,1).data[3] > 0;
                        var  pixelAlphaW = canvas1.drawingContext.getImageData(xp-r, yp  , 1,1).data[3] > 0;

                        var  alpha        = 45*Math.PI/180;
                        var  pixelAlphaSE = canvas1.drawingContext.getImageData(xp + r*p.cos(alpha) , yp + r*p.sin(alpha) , 1,1).data[3] > 0;
                        var  pixelAlphaNE = canvas1.drawingContext.getImageData(xp + r*p.cos(-alpha), yp + r*p.sin(-alpha), 1,1).data[3] > 0;
                  
                        if(pixelAlphaN || pixelAlphaS || pixelAlphaE || pixelAlphaW || pixelAlphaSE || pixelAlphaNE){

                              canvas1.drawingContext.globalCompositeOperation = "destination-out";
                              canvas1.circle(xp,yp,4*r);
                              particle.pos.x = 0 
                              particle.pos.y = p.windowHeight/2;

                              nCollisions++
                        };
                  };
          };

          p.ratioCollision = function(){
          
                  var Area      = canvas1.drawingContext.getImageData(xmin,ymin,2*R,2*R).data;
                  var allPixels = 0;
                  var colPixels = 0;

                  for(var index = 0; index < Area.length; index+=4){
                              
                        allPixels ++;

                        if( Area[index+3]>0 ){
                              colPixels ++;
                        };
                  };

                  return {allPixels,colPixels}
          };

};

var canvas0 = new p5(s0); // background image
var canvas1 = new p5(s1); // bitmap detection
var canvas2 = new p5(s2); // moving particles


