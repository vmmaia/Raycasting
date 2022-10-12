import { Vector2D } from "../util/util.js";

class Ray extends Vector2D{
    constructor(directionInRad){
        super(0, 0, 0, directionInRad);
    }

    /**
     * Checks the intersection between the ray and a given boundary
     * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
     * 
     * @param {*} cameraX Ray X origin
     * @param {*} cameraY Ray Y origin
     * @param {*} boundary Line segment to evaluate against
     * @returns Object with x and y coordinates of intersection {x, y} or false if no intersection
     */
    checkIntersection = (cameraX, cameraY, boundary) => {
        const boundaryPoints = boundary.getLineSegmentPoints();

        const x1 = cameraX;
        const y1 = cameraY;
        const x2 = x1 + Math.cos(this.direction);
        const y2 = y1 + Math.sin(this.direction);
        const x3 = boundaryPoints.x0;
        const y3 = boundaryPoints.y0;
        const x4 = boundaryPoints.x1;
        const y4 = boundaryPoints.y1;

        const denominator = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4));
        
        if(denominator === 0){
            return false;
        }

        const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/denominator;
        const u = ((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2))/denominator;

        if(u >= 0 && u <= 1 && t >= 0){
            return {
                x: x1 + t*(x2-x1),
                y: y1 + t*(y2-y1)
            }
        }

        return false;
    }
}

export default Ray;