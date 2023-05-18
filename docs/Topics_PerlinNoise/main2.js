

function setup() {

    createCanvas(windowWidth, windowHeight,WEBGL);
    //createCanvas(windowWidth, windowHeight);
    frameRate(2)
};

function draw() {
  
  background(255);strokeWeight(1);

  console.log(mouseX,mouseY)
  //myUtils.drawGrid({cellSize:50});
  
  var size = 200;

  var x0 = 50; var nx = 3;
  var y0 = 50; var ny = 3;


  for(let x=0;x<nx;x++){
     
      for(let y=0;y<ny;y++){
           
          var xc = x0 + x*size;
          var yc = y0 + y*size;
          rect(xc,yc,size);

          var linesx = myUtils.linspace(xc,xc+size,20);
          var linesy = myUtils.linspace(yc,yc+size,20);

          for(let i=0;i<linesx.length;i++){
            
           push();strokeWeight(0.25);stroke(0)
           line(linesx[i],yc,linesx[i],yc+size);
           line(xc,linesy[i],xc+size,linesy[i]);
           pop()
          }

      };
  };

  
};




