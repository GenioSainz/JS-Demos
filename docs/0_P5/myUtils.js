let myUtils = {
    
    drawGrid : function({cellSize = 50}={}){

        // This function draws a grid with a cellSize 
        // from (x,y)=(0,0) to (x,y)=(windowWidth,windowHeight)

        push()
    
            stroke(127,127,127);
            fill(127);
  
    
            for (var x=0; x < width; x+=cellSize ) {
              line(x, -height, x, height);
              text(x, x+1, cellSize /4);
            };
            for (var y=0; y < height; y+=cellSize ) {
              line(-width, y, width, y);
              text(y, 1, y+cellSize /4);
            };

        pop()

    },

    drawArrow : function(p1=[0,0], p2=[200,200], {module=undefined, double=false, arrowHead=0.1, color=[0,0,0]}={}){
       
      // Named default parameters via destructuring 
      
      // function functioName (var1,var2, { start=0, end=-1, step=1 } = {}) {
      
      //     The object pattern is an abbreviation of: { start: start=0, end: end=-1, step: step=1 }
      //     Use the variables `start`, `end` and `step` here

      // }
                 
      // ARROW FROM ----> TO     p1 [p1x,p1y] -----> p2 [p2x,p2y]

      // Equilateral triangle of side len 
      // coordinates respect (0,0)-->translate x2 (0,0)
      //     x2
      //   x1  x3
      
      var dx    = p2[0]-p1[0];
      var dy    = p2[1]-p1[1];
      var alpha = atan2(dy,dx);
      var len;

      if(module){
          
          p2[0] = p1[0] + Math.cos(alpha*Math.PI/180)*module;
          p2[1] = p1[1] + Math.sin(alpha*Math.PI/180)*module;
          len   = arrowHead*module;

      }else{

           len  = arrowHead*sqrt((p1[0]-p2[0])**2+(p1[1]-p2[1])**2);
      };

    
      var x1 = - len/2;
      var y1 =   len
    
      var x2 = 0;
      var y2 = 0;
    
      var x3 = + len/2
      var y3 =   len; 
      
      //stroke(colorStroke);

      // SEGMENT
      push()
       stroke(color);
       line(p1[0],p1[1],p2[0],p2[1]);
      pop()
      
      // P2
      push()
       fill(color);stroke(color);
       translate(p2[0],p2[1])
       rotate( +90 + alpha )
       triangle(x1, y1, x2, y2, x3, y3);
      pop()
      
      // P1
      if(double){

        push()
          fill(color);stroke(color);
          translate(p1[0],p1[1])
          rotate( -90 + alpha )
          triangle(x1, y1, x2, y2, x3, y3);
        pop()
        
      }

    },

    drawJoystick : function({x0=50, y0=50, joystickLen=250}={}){

      // This function creates a joystick (a 2D slider). 
      // with range  between X[-1,1] and Y[-1,1]. 

      push()

      var        xMax = x0 + joystickLen;
      var        yMax = y0 + joystickLen;
      var        xMed = x0 + joystickLen/2;
      var        yMed = y0 + joystickLen/2;

      fill(200) // JOYSTIC
      rect(x0,y0,joystickLen,joystickLen,joystickLen/25);

      strokeWeight(2)
      line(x0 ,yMed, xMax, yMed);  // X AXIS
      line(xMed, y0, xMed, yMax ); // Y AXIS
      this.drawArrow([xMed, yMed],[xMax, yMed],{arrowHead:0.05}); // X DIRECCTION
      this.drawArrow([xMed, yMed],[xMed, yMax],{arrowHead:0.05}); // Y DIRECCTION
     
      var boolX = mouseX <= xMax && mouseX >= x0;
      var boolY = mouseY <= yMax && mouseY >= y0;

      if (mouseIsPressed && (boolX && boolY)){
        
        strokeWeight(1)
          line(mouseX,y0,mouseX,yMax);
          line(x0,mouseY,xMax,mouseY)
          fill(255,0,0)
          circle(mouseX,mouseY,joystickLen/20)

          var joystickX = map(mouseX, x0, xMax, -1, 1).toFixed(3);
          var joystickY = map(mouseY, y0, yMax, -1, 1).toFixed(3);
          
          var ktxt = joystickLen/15;        // TEXT (X,Y)
          noFill();textAlign(CENTER,CENTER)
          text(`x: ${joystickX}`, xMed + 2*ktxt, yMed - ktxt);
          text(`y: ${joystickY}`, xMed + 2*ktxt, yMed + ktxt);

          return {joystickX,joystickY}
      };

      pop()
    

    },
};


