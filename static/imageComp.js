var capture;
var img;
var canvas;
var currentFrame = 0;
var lastFrame = currentFrame;
var img = new Array(numFrames);
var countdownEvent;
var count = 3;
var countdownActive = false;

function setup() {
    canvas = createCanvas(960, 720);
    canvas.parent('video-wrapper');
    capture = createCapture(VIDEO);
    capture.size(960, 720);
    capture.hide();
    for (var i = 0; i < numFrames; i ++){
        img[i] = loadImage('static/frames/frame_' + i + '.png'); 
    }
    textSize(80);
    textAlign(CENTER, CENTER);
    noFill();
}

function draw() {
    background(255);
    flipImage(capture);
    image(img[currentFrame], 0, 0 , 960, 720);
    text(count.toString(), width / 2, height / 2);
}

document.addEventListener('keydown', (e)=> {
    if (e.key == 'p' && !countdownActive) {
        countdownActive = true;
        fill(255);
        countdownEvent = setInterval(function(){
            if (count > 1){
                count--;
            }
            else {
                noFill();
                clearInterval(countdownEvent);
                count = 3;
                flipImage(capture);
                image(img[currentFrame], 0, 0, 960, 720);
                saveCanvas = document.getElementById('defaultCanvas0');
                postTweet("#DigVideoHead", saveCanvas.toDataURL('image/jpeg', 0.5));
                $('canvas').addClass('flash');
                $('canvas').bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () { $(this).removeClass('flash') });
                while (lastFrame == currentFrame) {
                    currentFrame = Math.floor(random(0, numFrames));
                }
                lastFrame = currentFrame;
                countdownActive = false;
            }
        }, 1000);
    }
}); 

function postTweet(content, image) {
    $.ajax({
        type: "POST",
        url: '/tweet',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"status":content,"image":image}),
        success: function () {
            console.log("Saved");
        }
    });
}

function flipImage(imageToFlip){
    push();
        translate(imageToFlip.width, 0);
        scale(-1.0, 1.0);
        image(imageToFlip, 0, 0, 960, 720);
    pop();
}