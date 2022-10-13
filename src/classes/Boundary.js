import { Vector2D } from "../util/util.js";

/**
 * Creates a line segment using a vector and a length
 */
class Boundary extends Vector2D{
    /**
     * Constructor for Boundary class
     * 
     * @param {*} x Origin X component
     * @param {*} y Origin Y component
     * @param {*} length Length of boundary from the origin
     * @param {*} directionInRad Direction of boundary from the origin
     */
    constructor(x, y, length, directionInRad){
        super(x, y, directionInRad);
        this.length = length;
    }

    /**
     * Get the points that define the boundary line segment
     * 
     * @returns Two points describing the line segment {x0, y0, x1, y1}
     */
    getBoundaryPoints = () => {
        return {
            x0: this.x,
            y0: this.y,
            x1: this.x + (Math.cos(this.direction) * this.length),
            y1: this.y + (Math.sin(this.direction) * this.length)
        }
    }
}

export default Boundary;