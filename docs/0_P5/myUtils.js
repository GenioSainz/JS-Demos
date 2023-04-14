let myUtils = {
    
    drawGrid : function(){

        // this function draws a grid with a cellSize 

        push()
    
            stroke(127,127,127);
            fill(127);
    
            var cellSize  = 50;
    
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

    
};