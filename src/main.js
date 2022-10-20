import Canvas from './classes/Canvas.js';
import Boundary from './classes/Boundary.js';
import Camera from './classes/Camera.js';
import { degToRad } from './util/util.js';

let DEBUG = false;
const REFRESH_RATE = 60;

const canvas = new Canvas;

let camera;
let numberOfBoundaries = 5;
let boundaries = [];

/**
 * Draws debug info on canvas
 */
const drawDebug = () => {
    const info = [
        "-- DEBUG ------------------",
        `canvas: ${canvas.width}x${canvas.height}`,
        `boundaries: ${numberOfBoundaries}`,
        `c_X: ${camera.x}`,
        `c_Y: ${camera.y}`,
        `c_D: ${camera.direction}`,
        `c_fov: ${camera.fov}`,
        `c_nr: ${camera.numberOfRays}`,
        `c_spd: ${camera.moveSpeed}`
    ]

    // Info
    for(let i=0, pos=15; i<info.length; i++, pos+=15){
        canvas.write(info[i], 10, pos, '#00ffff');
    }

    // Boundary numbers
    let boundaryCounter = 0;
    for(const boundary of boundaries){
        canvas.write(boundaryCounter, boundary.x, boundary.y, '#00ffff');
        boundaryCounter++;
    }

    // Camera direction vector
    canvas.drawLine(
        camera.x, 
        camera.y, 
        camera.x + (Math.cos(degToRad(camera.direction)) * 25),
        camera.y + (Math.sin(degToRad(camera.direction)) * 25),
        '#00ffff'
    )
}

/**
 * Draws boundaries on canvas
 */
const drawBoundaries = () => {
    for(const boundary of boundaries){
        const points = boundary.getBoundaryPoints();
        canvas.drawLine(points.x0, points.y0, points.x1, points.y1, "#fff");
    }
}

/**
 * Creates n boundaries of random length and origin in addition to the 4 canvas edges
 * 
 * @param {*} n Number of boundaries to create
 */
const createBoundaries = (n) => {
    const vectors = [];

    vectors.push(new Boundary(0, 0, canvas.width, degToRad(0)));
    vectors.push(new Boundary(0, 0, canvas.height, degToRad(90)));
    vectors.push(new Boundary(canvas.width, canvas.height, canvas.width, degToRad(180)));
    vectors.push(new Boundary(canvas.width, canvas.height, canvas.height, degToRad(270)));

    for(let i=0; i<n; i++){
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const length = 50 + Math.random() * (1000 - 50);
        const direction = Math.random() * 360;

        vectors.push(new Boundary(x, y, length, degToRad(direction)));
    }

    boundaries = vectors;
}

/**
 * Creates a Camera object at a x,y point and pointed in a direction
 * 
 * @param {*} x Position in the X axis
 * @param {*} y Position in the Y axis
 */
const createCamera = (x, y) => {
    camera = new Camera(x, y);
}

/**
 * Keyboard event listener
 */
const addListeners = () => {
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "w": camera.move('up');                    break;
            case "s": camera.move('down');                  break;
            case "a": camera.move('left');                  break;
            case "d": camera.move('right');                 break;
            case "+": camera.changeSpeed('accelerate');     break;
            case "-": camera.changeSpeed('break');          break;
            case "ArrowLeft": camera.rotate('left');        break;
            case "ArrowRight": camera.rotate('right');      break;
            case " ": DEBUG = !DEBUG;                       break;
            case "r": createBoundaries(numberOfBoundaries); break;
            case "t":
                numberOfBoundaries > 0 ? numberOfBoundaries-- : null;
                createBoundaries(numberOfBoundaries);
                break;
            case "y":
                numberOfBoundaries++;
                createBoundaries(numberOfBoundaries);
                break;
            case "n":
                camera.fov > 1 ? camera.fov-- : null;
                camera.createRays();
                break;
            case "m":
                camera.fov < 359 ? camera.fov++ : null;
                camera.createRays();
                break;
            case "z":
                camera.numberOfRays > 1 ? camera.numberOfRays-- : null;
                camera.createRays();
                break;
            case "x":
                camera.numberOfRays++;
                camera.createRays();
                break;
        }
    }, false);
}

/**
 * Initial instatiations
 */
const setup = () => {
    createBoundaries(numberOfBoundaries);
    createCamera(canvas.width / 2, canvas.height / 2);
    addListeners();
}

/**
 * Main logic loop
 */
const mainLoop = () => {
    canvas.clearCanvas();
    canvas.drawCircle(camera.x, camera.y, 5, '#ff0000');
    
    camera.castRays(boundaries);
    drawBoundaries();

    if(DEBUG) drawDebug();

    window.requestAnimationFrame(mainLoop);
}

setup();
mainLoop();