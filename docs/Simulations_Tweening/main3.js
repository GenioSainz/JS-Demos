
var tweenTime = 10000;

var target,point;
var x,y,alpha,radius
var cellSize = 35;
var kx       = 4;

var tweenArray = [];
var nTweens    = 5;

var img; 

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);textStyle(BOLD);

    img  = loadImage('../imgs/easing0.PNG' , img  => { image(img,  0, 0) });

    var tweenLength = Object.keys(tweenFunctions).length;
    var heights     = myUtils.linspace(cellSize,windowHeight-cellSize,tweenLength);
    var radius      = ( (windowHeight-3*cellSize)/tweenLength )/2
    var i           = 0;
    for (const property in tweenFunctions) {

      target = {
        x: windowWidth-kx*cellSize,
        y: heights[i],
        radius: radius,
        alpha: 0
      };

      point = {
        x: kx*cellSize,
        y: heights[i],
        radius: radius,
        alpha:1,
        easingFunc:property,
        height:heights[i]
      };

      var easingFunc = tweenFunctions[property];

      // constructor(obj, variables, duration, easingFunc, onProgress, onComplete)
      tweenArray.push( new tweenFull(point, {x:target.x, y:target.y, alpha: target.alpha}, tweenTime, easingFunc, updateTweens, updateTweens ) )
    
      i++;

    };  

  

};
            

function draw() {
  
    background(240);strokeWeight(2);

    push()
      translate(windowWidth/2 ,windowHeight/2);
      var w = img.width ;
      var h = img.height;
      image(img,-w/2,-h/2);
    pop()
    
    var i = 0;
    for (const property in tweenFunctions) {
      tweenArray[i].update();
      i++
    }

};

function updateTweens(tween){
  
    var {x,y,radius,alpha,easingFunc,height} = tween;
    var r = Math.round(255*alpha);
    var g = Math.round( map(alpha,1,0,0,255) )

    push();
      strokeWeight(0.5);line(kx*cellSize,height,windowWidth-kx*cellSize,height)
      noFill();stroke(255,0,0);circle(kx*cellSize,height,2*target.radius);            // initial Pos
      noFill();stroke(0,255,0);circle(windowWidth-kx*cellSize,height,2*target.radius);// end Pos
    pop()
    
    // tween position t
    fill(`rgb(${r},${g},0)`);circle(x,y,2*radius);
    
    //text
    fill(0);text(easingFunc,5,height)


};

function restart(tween){
     
  //updateTweens(tween)
  //window.location.reload()

  //console.log('init')

  //tween.startTime = new Date();

};




function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight);
  window.location.reload()

}