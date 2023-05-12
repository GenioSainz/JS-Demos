

function tweenX(obj, targetX, duration, easingFunc) {

    var startX    = obj.x;
    var changeX   = targetX - startX;
    var startTime = new Date();

    update();

    function update() {

        var time = new Date() - startTime;

        if(time < duration) {
            obj.x = easingFunc(time, startX, changeX, duration);
            requestAnimationFrame(update);
        }
        else {
            time = duration;
            obj.x = easingFunc(time, startX, changeX, duration);
        }
        render();
    };
};

function tweenFull(obj, props, duration, easingFunc, onProgress, onComplete) {

    var starts    = {};
    var changes   = {};
    var startTime = new Date();

    for(var prop in props) {
        starts[prop] = obj[prop];
        changes[prop] = props[prop] - starts[prop];
    }

    update();

    function update() {
        var time = new Date() - startTime;
        if(time < duration) {
            for(var prop in props) {
                obj[prop] = easingFunc(time, starts[prop], changes[prop], duration);
            }
            onProgress();
            requestAnimationFrame(update);
        }
        else {
            time = duration;
            for(var prop in props) {
                obj[prop] = easingFunc(time, starts[prop], changes[prop], duration);
            }
            onComplete();
        }
    }
}