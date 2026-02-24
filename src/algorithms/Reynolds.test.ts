import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Reynolds, ReynoldsOptions } from './Reynolds';
import { Boid } from '../core/Boid';
import { OptimizedReynolds } from './OptimizedReynolds';
import { Vector } from '../core/Vector';

describe('Reynolds Algorithms', () => {
    let boid: Boid;
    let boid2: Boid;
    let boid3: Boid;
    let boidFar: Boid;
    let options: ReynoldsOptions;

    beforeEach(() => {
        const getBaseBoid = (x: number, y: number, vx: number, vy: number) => {
            return new Boid({
                position: new Vector(x, y),
                velocity: new Vector(vx, vy),
                acceleration: new Vector(0, 0),
                maxSpeed: 4,
                minSpeed: 1,
                maxForce: 0.1,
                size: 5,
                color: 'blue'
            });
        };

        // Center boid moving right
        boid = getBaseBoid(100, 100, 2, 0);
        // Nearby boid moving up
        boid2 = getBaseBoid(110, 100, 0, 2);
        // Nearby boid moving down
        boid3 = getBaseBoid(90, 100, 0, -2);

        // Far boid moving left
        boidFar = getBaseBoid(500, 500, -2, 0);

        options = {
            perceptionRadius: 50,
            alignmentWeight: 1,
            cohesionWeight: 1,
            separationWeight: 1
        };
    });

    describe('Reynolds Base', () => {
        it('align should calculate average velocity of neighbors', () => {
            const align = Reynolds.align(boid, [boid, boid2, boid3, boidFar], 50);

            // neighbors in radius: boid2(0, 2), boid3(0, -2)
            // total vel = (0, 0), avg vel = (0, 0)
            // desired is (0,0), so (0,0) - boid.vel = (-2, 0)
            // capped by maxForce (0.1) -> (-0.1, 0)
            expect(align.x).toBeCloseTo(-0.1);
            expect(align.y).toBeCloseTo(0);
        });

        it('cohesion should steer towards center of mass of neighbors', () => {
            const cohesion = Reynolds.cohesion(boid, [boid, boid2, boid3, boidFar], 50);

            // neighbors in radius: boid2(110, 100), boid3(90, 100)
            // center = (100, 100)
            // steering towards (100, 100) from (100, 100) -> 0 desired vector
            // 0 - (2, 0) = (-2, 0), limited to 0.1 -> (-0.1, 0)
            expect(cohesion.x).toBeCloseTo(-0.1);
            expect(cohesion.y).toBeCloseTo(0);
        });

        it('separation should steer away from neighbors inversely proportional to distance', () => {
            const boid4 = new Boid({
                position: new Vector(102, 100),
                velocity: new Vector(0, 0),
                acceleration: new Vector(0, 0),
                maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 5, color: ''
            });

            // boid is at 100, 100. neighbor is at 102, 100.
            // diff is (-2, 0) divided by dist^2 (4) = (-0.5, 0)
            const separation = Reynolds.separation(boid, [boid, boid4], 50);

            // result should be a vector pointing left (-x), capped by maxForce
            expect(separation.x).toBeLessThan(0);
            expect(separation.y).toBeCloseTo(0);
        });

        it('flock should apply all three forces to boid.acceleration', () => {
            boid.applyForce = vi.fn();

            Reynolds.flock(boid, [boid, boid2, boid3], options);

            // align, cohesion, separation each applied once
            expect(boid.applyForce).toHaveBeenCalledTimes(3);
        });
    });

    describe('OptimizedReynolds', () => {
        it('should only pass up to 7 nearest neighbors to super.flock', () => {
            const boids: Boid[] = [boid];
            // Create 10 nearby boids
            for (let i = 1; i <= 10; i++) {
                boids.push(new Boid({
                    position: new Vector(100 + i, 100), // d2 = i^2
                    velocity: new Vector(0, 0),
                    acceleration: new Vector(0, 0),
                    maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 5, color: ''
                }));
            }

            boid.applyForce = vi.fn(); // Mock to prevent actual state change on boid 

            // Just spy on super class method directly here
            const flockSpy = vi.spyOn(Reynolds, 'flock');

            OptimizedReynolds.flock(boid, boids, { ...options, perceptionRadius: 20 }); // radius 20 covers i <= 20

            // It should call super.flock with exactly 7 neighbors (since we have 10 in radius)
            expect(flockSpy).toHaveBeenCalled();
            const calledNeighbors = flockSpy.mock.calls[0][1];
            expect(calledNeighbors.length).toBe(7);

            // Ensure they are sorted closest first
            expect(calledNeighbors[0].position.x).toBe(101); // i=1
            expect(calledNeighbors[6].position.x).toBe(107); // i=7
        });
    });
});
