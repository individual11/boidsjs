import { describe, it, expect, beforeEach } from 'vitest';
import { Boid, BoidOptions } from './Boid';
import { Vector } from './Vector';

describe('Boid', () => {
    let options: BoidOptions;

    beforeEach(() => {
        options = {
            position: new Vector(10, 10),
            velocity: new Vector(1, 1),
            acceleration: new Vector(0, 0),
            maxSpeed: 5,
            minSpeed: 1,
            maxForce: 0.1,
            size: 3,
            color: '#ffffff'
        };
    });

    it('should initialize with provided options', () => {
        const boid = new Boid(options);

        // Validate copies are made for vectors
        expect(boid.position).not.toBe(options.position);
        expect(boid.position.x).toBe(10);
        expect(boid.position.y).toBe(10);

        expect(boid.velocity).not.toBe(options.velocity);
        expect(boid.acceleration).not.toBe(options.acceleration);

        expect(boid.maxSpeed).toBe(5);
        expect(boid.minSpeed).toBe(1);
        expect(boid.maxForce).toBe(0.1);
        expect(boid.size).toBe(3);
        expect(boid.color).toBe('#ffffff');
    });

    it('should apply force to acceleration', () => {
        const boid = new Boid(options);
        const force = new Vector(0.5, 0.5);
        boid.applyForce(force);

        expect(boid.acceleration.x).toBe(0.5);
        expect(boid.acceleration.y).toBe(0.5);

        // Apply another force to ensure it adds up
        boid.applyForce(new Vector(0.1, 0.2));
        expect(boid.acceleration.x).toBe(0.6);
        expect(boid.acceleration.y).toBe(0.7);
    });

    it('should update position, velocity, and reset acceleration', () => {
        // Initial vel = (1, 1) -> mag ~1.414 (within minSpeed 1 and maxSpeed 5)
        const boid = new Boid(options);
        boid.acceleration = new Vector(1, 0); // Apply some acceleration

        boid.update();

        // Velocity should be oldVel (1, 1) + acc (1, 0) = (2, 1)
        expect(boid.velocity.x).toBe(2);
        expect(boid.velocity.y).toBe(1);

        // Position should be oldPos (10, 10) + newVel (2, 1) = (12, 11)
        expect(boid.position.x).toBe(12);
        expect(boid.position.y).toBe(11);

        // Acceleration should be reset to (0, 0)
        expect(boid.acceleration.x).toBe(0);
        expect(boid.acceleration.y).toBe(0);
    });

    it('should limit velocity to maxSpeed', () => {
        options.maxSpeed = 2;
        const boid = new Boid(options);

        // Push acceleration way beyond maxSpeed
        boid.acceleration = new Vector(10, 0);

        boid.update();

        expect(boid.velocity.mag()).toBeCloseTo(2);
    });

    it('should enforce minSpeed', () => {
        options.minSpeed = 3;
        options.velocity = new Vector(0.5, 0.5); // mag ~0.707
        const boid = new Boid(options);

        boid.update(); // Velocity should scale up to minSpeed

        expect(boid.velocity.mag()).toBeCloseTo(3);
    });

    it('should not enforce minSpeed if it is 0 or negative', () => {
        options.minSpeed = 0;
        options.velocity = new Vector(0.5, 0.5); // mag ~0.707
        const boid = new Boid(options);

        boid.update();

        // Velocity magnitude remains unchanged
        expect(boid.velocity.mag()).toBeLessThan(1);
    });

    describe('edges wrapping', () => {
        const width = 100;
        const height = 100;

        it('should wrap around the right edge', () => {
            const boid = new Boid(options);
            boid.position.x = 105;
            boid.edges(width, height);
            expect(boid.position.x).toBe(0);
        });

        it('should wrap around the left edge', () => {
            const boid = new Boid(options);
            boid.position.x = -5;
            boid.edges(width, height);
            expect(boid.position.x).toBe(width);
        });

        it('should wrap around the bottom edge', () => {
            const boid = new Boid(options);
            boid.position.y = 105;
            boid.edges(width, height);
            expect(boid.position.y).toBe(0);
        });

        it('should wrap around the top edge', () => {
            const boid = new Boid(options);
            boid.position.y = -5;
            boid.edges(width, height);
            expect(boid.position.y).toBe(height);
        });

        it('should not change position if within boundaries', () => {
            const boid = new Boid(options);
            boid.position.x = 50;
            boid.position.y = 50;
            boid.edges(width, height);
            expect(boid.position.x).toBe(50);
            expect(boid.position.y).toBe(50);
        });
    });
});
