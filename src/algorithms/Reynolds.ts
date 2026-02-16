import { Vector } from '../core/Vector';
import { Boid } from '../core/Boid';

export interface ReynoldsOptions {
    perceptionRadius: number; // radius to look for neighbors
    separationWeight: number; // how strongly boids try to avoid each other
    alignmentWeight: number; // how strongly boids try to match the velocity of neighbors
    cohesionWeight: number; // how strongly boids try to stay close to neighbors
}

export class Reynolds {
    static align(boid: Boid, neighbors: Boid[], radius: number): Vector {
        const steering = new Vector();
        let total = 0;
        for (const other of neighbors) {
            const d = boid.position.dist(other.position);
            if (other !== boid && d < radius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(boid.maxSpeed);
            steering.sub(boid.velocity);
            steering.limit(boid.maxForce);
        }
        return steering;
    }

    static cohesion(boid: Boid, neighbors: Boid[], radius: number): Vector {
        const steering = new Vector();
        let total = 0;
        for (const other of neighbors) {
            const d = boid.position.dist(other.position);
            if (other !== boid && d < radius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(boid.position);
            steering.setMag(boid.maxSpeed);
            steering.sub(boid.velocity);
            steering.limit(boid.maxForce);
        }
        return steering;
    }

    static separation(boid: Boid, neighbors: Boid[], radius: number): Vector {
        const steering = new Vector();
        let total = 0;
        for (const other of neighbors) {
            const d = boid.position.dist(other.position);
            if (other !== boid && d < radius) {
                const diff = Vector.sub(boid.position, other.position);
                diff.div(d * d); // Weight by distance
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(boid.maxSpeed);
            steering.sub(boid.velocity);
            steering.limit(boid.maxForce);
        }
        return steering;
    }

    static flock(boid: Boid, neighbors: Boid[], options: ReynoldsOptions): void {
        const alignment = this.align(boid, neighbors, options.perceptionRadius);
        const cohesion = this.cohesion(boid, neighbors, options.perceptionRadius);
        const separation = this.separation(boid, neighbors, options.perceptionRadius);

        alignment.mult(options.alignmentWeight);
        cohesion.mult(options.cohesionWeight);
        separation.mult(options.separationWeight);

        boid.applyForce(alignment);
        boid.applyForce(cohesion);
        boid.applyForce(separation);
    }
}
