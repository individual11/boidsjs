import { Vector } from '../core/Vector';
import { Boid } from '../core/Boid';
import { Noise } from '../core/Noise';

export interface FlowFieldOptions {
    scale: number;
    strength: number;
}

export class FlowField {
    apply(boid: Boid, noise: Noise, options: FlowFieldOptions, z: number): void {
        const x = boid.position.x * options.scale;
        const y = boid.position.y * options.scale;
        const angle = noise.noise(x, y, z) * Math.PI * 2 * 2; // Expand range
        const force = new Vector(Math.cos(angle), Math.sin(angle));
        force.setMag(options.strength);
        boid.applyForce(force);
    }
}
