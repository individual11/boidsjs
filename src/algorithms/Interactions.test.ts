import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Interactions } from './Interactions';
import { Boid } from '../core/Boid';
import { Vector } from '../core/Vector';

describe('Interactions', () => {
    let boid: Boid;

    beforeEach(() => {
        boid = new Boid({
            position: new Vector(100, 100),
            velocity: new Vector(2, 0),
            acceleration: new Vector(0, 0),
            maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 5, color: ''
        });
        boid.applyForce = vi.fn();
    });

    describe('flee', () => {
        it('should steer away from predators within radius', () => {
            const predator = new Boid({
                position: new Vector(102, 100),
                velocity: new Vector(0, 0),
                acceleration: new Vector(0, 0),
                maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 5, color: ''
            });

            // predator is at 102, boid at 100. Diff = (-2, 0).
            Interactions.flee(boid, [predator], 10);

            // Boid should apply force to move left (-x)
            expect(boid.applyForce).toHaveBeenCalled();
            const force = (boid.applyForce as any).mock.calls[0][0] as Vector;
            expect(force.x).toBeLessThan(0);
            expect(force.y).toBeCloseTo(0); // Only x diff
        });

        it('should ignore predators outside radius', () => {
            const predator = new Boid({
                position: new Vector(200, 100),
                velocity: new Vector(0, 0),
                acceleration: new Vector(0, 0),
                maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 5, color: ''
            });

            Interactions.flee(boid, [predator], 50);

            expect(boid.applyForce).not.toHaveBeenCalled();
        });
    });

    describe('seek', () => {
        it('should steer towards the closest target within radius', () => {
            const target1 = new Vector(150, 100); // dist 50
            const target2 = new Vector(120, 100); // dist 20

            Interactions.seek(boid, [target1, target2], 100);

            expect(boid.applyForce).toHaveBeenCalled();
            const force = (boid.applyForce as any).mock.calls[0][0] as Vector;

            // Should steer towards target2 (120, 100) -> right (+x)
            // desired is (20, 0), velocity is (2, 0). 
            // setMag(maxSpeed) on desired -> (4, 0).
            // steer = desired - velocity = (2, 0).
            // limited by maxForce (0.1) -> (0.1, 0)
            expect(force.x).toBeCloseTo(0.1);
            expect(force.y).toBeCloseTo(0);
        });

        it('should ignore targets outside radius', () => {
            const target = new Vector(250, 100);

            Interactions.seek(boid, [target], 100);

            expect(boid.applyForce).not.toHaveBeenCalled();
        });
    });
});
