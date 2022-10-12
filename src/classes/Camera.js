import Canvas from './Canvas.js';
import Ray from './Ray.js';
import {degToRad, distanceBetweenTwoPoints, sanatizeDegrees, sanatizeRadians} from '../util/util.js';

class Camera{
    canvas;
    rays = [];
    moveSpeed = 10;
    turnSpeed = 5;

    /**
     * Camera constructor
     * 
     * @param {*} x Position X component
     * @param {*} y Position Y component
     * @param {*} direction Direction in degrees
     * @param {*} fov Field of view in degrees
     * @param {*} numberOfRays Number of rays to cast
     */
    constructor(x, y, direction, fov, numberOfRays){
        this.x = x;
        this.y = y;
        this.fov = sanatizeDegrees(fov);
        this.direction = sanatizeDegrees(direction);
        this.numberOfRays = numberOfRays;
        
        this.canvas = new Canvas;
        this.createRays();
    }

    /**
     * Creates ray vectors acording to field of view and number of rays
     */
    createRays = () => {
        const rays = [];
        
        if(this.numberOfRays === 1){
            rays.push(new Ray(degToRad(this.direction)));
        }else{
            const step = degToRad(this.fov) / (this.numberOfRays - 1);
            const firstRayDirection = degToRad(this.direction) + (degToRad(this.fov) / 2);
            
            for(let i=0; i<this.numberOfRays; i++){
                const rayDirection = firstRayDirection - (i * step);
    
                rays.push(
                    new Ray(sanatizeRadians(rayDirection))
                );
            }
        }

        this.rays = rays;
    }

    /**
     * Apply a rotation delta to the casting rays array
     * 
     * @param {*} delta Amount in degrees to rotate the rays
     */
    rotateRays = (delta) => {
        this.direction = sanatizeDegrees(this.direction + delta);
        
        for(const ray of this.rays){
            ray.direction = sanatizeRadians(ray.direction + degToRad(delta));
        }
    }

    /**
     * Casts the rays against the boundaries and draws until the nearest intersection
     * 
     * @param {*} boundaries Boundaries which to evaluate intersection
     */
    castRays = (boundaries) => {
        for(const ray of this.rays){
            let nearestIntersection;

            for(const boundary of boundaries){
                const intersection = ray.checkIntersection(this.x, this.y, boundary);

                if(intersection !== false){
                    const distance = distanceBetweenTwoPoints(this.x, this.y, intersection.x, intersection.y);

                    if(nearestIntersection === undefined || nearestIntersection.distance > distance){
                        nearestIntersection = {...intersection, distance}
                    }
                }
            }

            if(nearestIntersection){
                this.canvas.drawLine(
                    this.x, 
                    this.y, 
                    nearestIntersection.x,
                    nearestIntersection.y,
                    "#550000"
                )
            }
        }
    }

    /**
     * Change camera position in the XY axis
     * 
     * @param {*} direction Direction which to move the camera. "up", "down", "left", "right"
     */
    move = (direction) => {
        switch (direction) {
            case "up":
                this.y - this.moveSpeed > 1 ? this.y -= this.moveSpeed : this.y = 1;
                break;
            case "down":
                this.y + this.moveSpeed < this.canvas.height - 1 ? this.y += this.moveSpeed : this.y = this.canvas.height - 1;
                break;
            case "left":
                this.x - this.moveSpeed > 1 ? this.x -= this.moveSpeed : this.x = 1;
                break;
            case "right":
                this.x + this.moveSpeed < this.canvas.width - 1 ? this.x += this.moveSpeed : this.x = this.canvas.width - 1;
                break;
        }
    }

    /**
     * Changes camera movement speed by one unit
     * 
     * @param {*} delta Direction which to change the speed. "accelerate" or "break"
     */
    changeSpeed = (delta) => {
        switch (delta) {
            case "accelerate":
                this.moveSpeed += 1;
                break;
            case "break":
                this.moveSpeed <= 1 ? null : this.moveSpeed -= 1;
                break;
        }
    }

    /**
     * Rotate camera acording to direction
     * 
     * @param {*} direction Direction which to rotate the camera. "left" or "right"
     */
    rotate = (direction) => {
        switch(direction){
            case "left":
                this.rotateRays(this.turnSpeed);
                break;
            case "right":
                this.rotateRays(-this.turnSpeed);
                break;
        }
    }
}

export default Camera;