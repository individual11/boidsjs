import { Vector } from '../core/Vector';
import { Boid } from '../core/Boid';
import { Noise } from '../core/Noise';

export interface FlowFieldOptions {
    scale: number;
    strength: number;
    /**
     * Multiplier on the time (z) dimension of the noise sample.
     * Higher values make the flow field evolve faster over time.
     * @default 1
     */
    timeShift?: number;
}

export class FlowField {
    apply(boid: Boid, noise: Noise, options: FlowFieldOptions, z: number): void {
        const x = boid.position.x * options.scale;
        const y = boid.position.y * options.scale;
        const timeShift = options.timeShift ?? 1;
        const angle = noise.noise(x, y, z * timeShift) * Math.PI * 4; // Expand range
        const force = new Vector(Math.cos(angle), Math.sin(angle));
        force.setMag(options.strength);
        boid.applyForce(force);
    }
}
