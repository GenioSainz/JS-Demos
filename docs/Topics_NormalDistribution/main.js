   
var randomIterations = 5;
var nBars = 250;
var barWidth;
var barHeights = [];

function setup() {
    createCanvas(windowWidth,windowHeight);
    initBarsHeight();
    barWidth = windowWidth/nBars;
    
};

function draw(){

    background(255);
    line(windowWidth/2,0,windowWidth/2,windowHeight);
    for(let i=0;i<nBars;i++){
        var alpha = map(barHeights[i],0,-windowHeight,0,1)
        fill(`rgba(255,0,0,${alpha})`)
        rect(barWidth*i,windowHeight,barWidth,barHeights[i]);
    };

    for(let i=0;i<nBars;i++){
        
        var index = Math.floor( randomN(0,nBars,randomIterations) );
        barHeights[index] += -0.5;

        if( barHeights[index]<-windowHeight ){

            initBarsHeight();
        };
    };
};

function initBarsHeight(){

    barHeights = [];

    for(let i=0;i<nBars;i++){
        
        barHeights.push(0);
    };
};

function randomAB(a,b){

    return  (b-a)*Math.random() + a 
}

function randomN(a,b,iterations){
    
    var sum = 0;
    for(let i=0;i<iterations;i++){

        sum += randomAB(a,b);
    };

    return sum/iterations
}
