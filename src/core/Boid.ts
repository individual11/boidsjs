import { Vector } from './Vector';

export interface BoidOptions {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    maxSpeed: number;
    minSpeed: number;
    maxForce: number;
    size: number;
    color: string;
}

export class Boid {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    maxSpeed: number;
    minSpeed: number;
    maxForce: number;
    size: number;
    color: string;

    constructor(options: BoidOptions) {
        this.position = options.position.copy();
        this.velocity = options.velocity.copy();
        this.acceleration = options.acceleration.copy();
        this.maxSpeed = options.maxSpeed;
        this.minSpeed = options.minSpeed;
        this.maxForce = options.maxForce;
        this.size = options.size;
        this.color = options.color;
    }

    applyForce(force: Vector) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        // Enforce minSpeed
        if (this.velocity.mag() < this.minSpeed && this.minSpeed > 0) {
            this.velocity.setMag(this.minSpeed);
        }

        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    edges(width: number, height: number) {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }

        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }
}
