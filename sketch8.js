let screenW = 800;
let screenH = 1200;
let fps = 30;

let zin = "GELUID KLEUR BEWEGING VROLIJK OPEN CULTUUR TRANSPARANT EERLIJK DIGITAAL ANALOOG PERSOONLIJK EXPERIMENT SAMEN";
let woorden;
let woordCount = 0;

let m;
let maskImg;

let angle = 0;
let t = 0;

let circleW = screenW * 0.75;
let circleH = screenH;
let circleWStart = circleW;
let circleMaxW = screenW * 0.9;

let circleGrowth = 5;
let circleSpeed = 0.005;

let margeX = 100;
let margeY = 40;

let rects = [];
let rectCountTotal = 5;
let available = screenW - 2 * margeX;
let step = available / (rectCountTotal - 1);
let space = 0.8;                 // 0..1 (kleiner = meer ruimte tussen balken)
let rectW = step * space;
let rectH = screenH - 2 * margeY;
let rectH_speed = 4;
let rectStrokeWeight = 3;

let canvas;

let lastDirection = 0;
let draaiSound;
let draaiSound2;
let draaiCount = 0;
let sounds = [];
let soundCount = 0;





function preload() {
    font = loadFont("Dazzed-Medium.otf");
    sound1 = loadSound("tik_3.WAV");
    sound2 = loadSound("tikkkk.WAV");
    sound3 = loadSound("groei_2.WAV");
    sound4 = loadSound("tik_2.WAV");
    sound5 = loadSound("toon.WAV");
    sounds = [sound1, sound2, sound3, sound4];
    draaisound = loadSound("draai_2.WAV");
    draaisound2 = loadSound("draai_1.WAV");




}

function setup() {


    canvas = createCanvas(screenW, screenH);
    pixelDensity(1)
    rectMode(CENTER);
    imageMode(CENTER);
    makebg();
    frameRate(fps);




    // mask: circle in het midden 
    m = createGraphics(width, height);
    m.pixelDensity(1)

    for (let i = 0; i < zin.length; i += 1) {
        woorden = split(zin, ' ');
    }

    for (let i = 0; i < rectCountTotal; i += 1) {
        if (woordCount > woorden.length) { woordCount = 0; }
        let x = margeX + i * step

        let rect = new Rectangle(i, x, height / 2, rectW, rectH, rectH_speed, height - (margeY * 2), 10, font, woorden[woordCount]);
        rects.push(rect);
        woordCount += 1

    }










}

function draw() {





    background("#ffffffff");

    // verticale rechthoeken
    strokeWeight(10);


    for (index in rects) {
        rects[index].grow();
        rects[index].show();
        rects[index].showText();
        //rects[index].update();

    }

    if (frameCount % 40 === 0) {
        let rectsColoring = rects.filter(r => !r.coloring);
        let rect = rects[int(random(0, rects.length))];
        rect.set_color(int(random(0, 3)));
        rect.setText(woorden[woordCount]);
        woordCount += 1;
        if (woordCount >= woorden.length) {
            woordCount = 0;
        }
        playSound();






    }




    //circleGrow();

    makemask(m);

    //

    circleSpeed = speedingMaskImg(circleSpeed);
    placeMaskImg(width / 2, height / 2, circleSpeed);

    fill(0);
    textSize(12);
    //text("FPS: " + nf(frameRate(), 2, 1), 10, 20);



}


function playSound() {
    sound = sounds[soundCount];
    sound.play();
    soundCount += 1;
    if (soundCount >= sounds.length) {
        soundCount = 0;
    }

}

function circleGrow() {
    circleW += circleGrowth;
    if (circleW < 50 || circleW > circleMaxW) {
        circleGrowth *= -1;
    }
}

function speedingMaskImg(circleSpeed) {
    t = millis() * 0.001;
    circleSpeed = sin(t * 0.5) * 0.05;
    // Bepaal huidige richting
    let currentDirection = (circleSpeed >= 0) ? 1 : -1;

    // Check of richting veranderd is
    if (currentDirection !== lastDirection) {
        if (currentDirection === 1) {
            draaisound2.play(); // rechtsom
        } else {
            draaisound.play(); // linksom
        }
    }

    // Update de vorige richting
    lastDirection = currentDirection;

    angle += circleSpeed;

    return circleSpeed;
}


function placeMaskImg(x, y, circleSpeed) {
    push();
    translate(x, y);
    rotate(angle);
    image(maskImg, 0, 0, width, height);
    pop();

}

function makebg() {

    for (let n = 0; n < rectCountTotal; n++) {
        let x = margeX + n * step;
        rect(x, height / 2, rectW, rectH, 3);
    }
}


function makemask(m) {
    //filter(BLUR, 2);
    maskImg = get(); // p5.Image

    m.clear(); // anders te veel geheugen gebruiken
    m.noStroke();
    m.circle(width / 2, height / 2, circleW, circleH);
    m = m.get();
    maskImg.mask(m); // wit = zichtbaar, zwart = onzichtbaar
}



class Rectangle {
    constructor(i, x, y, w, h, s, maxH, sW, font, txt) {
        this.index = i;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = s;
        this.maxH = maxH;
        this.coloring = false;
        this.timer = 0;
        this.c = color(random(100, 255), random(30, 255), random(30, 255));
        this.c2 = color(random(30, 200), random(30, 255), random(100, 255));
        this.strokeWeight = sW;
        this.txt = txt;
        this.font = font;

    }

    setText(t) {
        this.txt = t;
    }

    set_color(i) {

        this.c = color(random(100, 255), random(30, 255), random(30, 255));
        this.c2 = color(random(30, 200), random(30, 255), random(100, 255));


    }

    show() {
        strokeWeight(this.strokeWeight);


        fill(this.c);
        stroke(this.c2);

        rect(this.x, this.y, this.w, this.h, 80);


    }

    showText() {
        textFont(this.font);

        push();

        translate(this.x, this.y);
        textAlign(CENTER, CENTER);
        rotate(radians(90));

        fill(this.c2);
        noStroke()
        textSize(this.w * 0.8);

        let stretchFactor = 0.7 * this.h / this.maxH;
        scale(stretchFactor, stretchFactor);

        text(this.txt, 0, -15);
        pop();

    }

    grow() {

        let t = millis() * 0.002;
        let s = sin(t + this.index * 0.1);
        let minSize = height * 0.3;
        let maxSize = height * 0.9;
        let size = map(s, -1, 1, minSize, maxSize);
        this.h = size;


    }

}