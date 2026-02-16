import { Vector } from '../core/Vector';
import { Boid } from '../core/Boid';

export class Interactions {
    // avoid "predators"
    static flee(boid: Boid, predators: Boid[], radius: number): void {
        const steering = new Vector();
        let total = 0;
        for (const predator of predators) {
            const d = boid.position.dist(predator.position);
            if (d < radius) {
                const diff = Vector.sub(boid.position, predator.position);
                diff.div(d); // Stronger force when closer
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(boid.maxSpeed * 1.5); // Run faster!
            steering.sub(boid.velocity);
            steering.limit(boid.maxForce * 2);
            boid.applyForce(steering);
        }
    }

    // go to "targets"
    static seek(boid: Boid, targets: Vector[], radius: number): void {
        let closest: Vector | null = null;
        let minDist = Infinity;

        for (const target of targets) {
            const d = boid.position.dist(target);
            if (d < radius && d < minDist) {
                minDist = d;
                closest = target;
            }
        }

        if (closest) {
            const desired = Vector.sub(closest, boid.position);
            desired.setMag(boid.maxSpeed);
            const steer = Vector.sub(desired, boid.velocity);
            steer.limit(boid.maxForce);
            boid.applyForce(steer);
        }
    }
}
