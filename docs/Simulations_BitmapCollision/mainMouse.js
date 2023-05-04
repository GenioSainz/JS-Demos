
// var canvas0 = new p(s0); // background image
// var canvas1 = new p(s1); // bitmap detection
// var canvas2 = new p(s2); // moving particles

var R = 100;
var r = 1;
var pixelAlpha = 0;

var s0 = function( p ) {
          
          img = p.loadImage('../imgs/space.jpg');
          p.setup = function(){

                    p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                    p.image(img,0,0)
          };

          p.windowResized = function(){
            window.location.reload()
          }

          // p.draw = function() {
          // };
};

var s1 = function( p ) {
          
          p.setup = function(){

                p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                p.fill(0);p.noStroke();
                p.circle(p.windowWidth/2,p.windowHeight/2,2*R);
          };
         
          p.draw = function() {

            var xm = p.mouseX;
            var ym = p.mouseY;

            console.log({xm,ym})

            var pixelAlpha = canvas1.drawingContext.getImageData(xm,ym,1,1).data[3];
            
            if(pixelAlpha>0){

                  // canvas1.drawingContext.globalCompositeOperation = "destination-out";
                  // canvas1.circle(xm,ym,2*r);

                  // nCollisions++

                  console.log({pixelAlpha,xm,ym});

            };
          };
};

var s2  = function( p ) {
      
          var nCollisions   = 0;
      
          p.setup = function() {
            
                p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
          };

          p.draw = function() {
            
            p.clear();p.fill(0);

            p.fill(255);p.text(`N. Collisions: ${nCollisions}`,p.windowWidth/2,20)
            p.fill(255);p.text(`Pixel Alpha:   ${pixelAlpha}`,p.windowWidth/2,40)


            p.noFill();p.stroke(0)
        
            var xm = p.mouseX;
            var ym = p.mouseY;

            p.circle(xm,ym,2*r);
            
            p.strokeWeight(4)
            p.line(p.windowWidth/2,0,p.windowWidth/2,p.windowHeight);
            p.line(0,p.windowHeight/2,p.windowWidth,p.windowHeight/2);
            // var imageData  = canvas1.drawingContext.getImageData(xm,ym,1,1).data;
            // var pixelAlpha = imageData[3];
            
            pixelAlpha = canvas1.drawingContext.getImageData(xm,ym,1,1).data[3] ;
         
            if(pixelAlpha>0){

                  canvas1.drawingContext.globalCompositeOperation = "destination-out";
                  canvas1.circle(xm,ym,2*r);

                  nCollisions++

                  console.log({pixelAlpha,xm,ym});

            };

      

          };
};

//var canvas0 = new p5(s0); // background image
var canvas1 = new p5(s1); // bitmap detection
//var canvas2 = new p5(s2); // moving particles


