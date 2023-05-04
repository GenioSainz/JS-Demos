
// var canvas0 = new p(s0); // background image
// var canvas1 = new p(s1); // bitmap detection
// var canvas2 = new p(s2); // moving particles

var R = 100;
var r = 20;

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
                p.circle(p.windowWidth/2,p.windowHeight/2,2*R);
          };

          // p.draw = function() {
          // };
};

var s2  = function( p ) {
      
          var nCollisions   = 0;
      
          p.setup = function() {
            
                p.createCanvas(p.windowWidth,p.windowHeight).position(0,0);
                
          };

          p.draw = function() {
            
            p.clear();p.fill(0);

            p.fill(255);p.text(`N. Collisions: ${nCollisions}`,p.windowWidth/2,p.windowHeight/2)

            var xm = p.mouseX;
            var ym = p.mouseY;

            p.circle(xm,ym,2*r);

           
            // var imageData  = canvas1.drawingContext.getImageData(xm,ym,1,1).data;
            // var pixelAlpha = imageData[3];
            
            var  pixelAlphaN = canvas1.drawingContext.getImageData(xm,ym-r,1,1).data[3] > 0;
            var  pixelAlphaS = canvas1.drawingContext.getImageData(xm,ym+r,1,1).data[3] > 0;
            var  pixelAlphaE = canvas1.drawingContext.getImageData(xm+r,ym,1,1).data[3] > 0;
            var  pixelAlphaW = canvas1.drawingContext.getImageData(xm-r,ym,1,1).data[3] > 0;

            if(pixelAlphaN || pixelAlphaS || pixelAlphaE || pixelAlphaW ){

                  canvas1.drawingContext.globalCompositeOperation = "destination-out";
                  canvas1.circle(xm,ym,2*r);

                  nCollisions++

            };

      

          };
};

var canvas0 = new p5(s0); // background image
var canvas1 = new p5(s1); // bitmap detection
var canvas2 = new p5(s2); // moving particles


