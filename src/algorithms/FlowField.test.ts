import { describe, it, expect, vi } from 'vitest';
import { FlowField, FlowFieldOptions } from './FlowField';
import { Boid } from '../core/Boid';
import { Noise } from '../core/Noise';
import { Vector } from '../core/Vector';

describe('FlowField', () => {
    it('should calculate angle from noise and apply force to boid', () => {
        const boid = new Boid({
            position: new Vector(10, 20),
            velocity: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 5, color: ''
        });

        // Mock noise to return a consistent value, e.g., 0.125
        const noise = new Noise();
        const noiseSpy = vi.spyOn(noise, 'noise').mockReturnValue(0.125);

        boid.applyForce = vi.fn();

        const flowField = new FlowField();
        const options: FlowFieldOptions = { scale: 0.1, strength: 0.05 };

        flowField.apply(boid, noise, options, 0);

        // x = 10 * 0.1 = 1.0, y = 20 * 0.1 = 2.0, z = 0
        expect(noiseSpy).toHaveBeenCalledWith(1.0, 2.0, 0);

        // angle = 0.125 * Math.PI * 2 * 2 = 0.5 * Math.PI (90 degrees)
        // force = (cos(90deg), sin(90deg)) = (0, 1) roughly
        // scaled by strength 0.05 -> (0, 0.05)
        expect(boid.applyForce).toHaveBeenCalled();
        const forceArg = (boid.applyForce as any).mock.calls[0][0];
        expect(forceArg.x).toBeCloseTo(0);
        expect(forceArg.y).toBeCloseTo(0.05);
    });
});
