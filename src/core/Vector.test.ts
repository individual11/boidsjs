import { describe, it, expect } from 'vitest';
import { Vector } from './Vector';

describe('Vector', () => {
    it('should initialize with default values', () => {
        const v = new Vector();
        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('should initialize with provided values', () => {
        const v = new Vector(3, 4);
        expect(v.x).toBe(3);
        expect(v.y).toBe(4);
    });

    it('should add another vector', () => {
        const v1 = new Vector(1, 2);
        const v2 = new Vector(3, 4);
        v1.add(v2);
        expect(v1.x).toBe(4);
        expect(v1.y).toBe(6);
    });

    it('should subtract another vector', () => {
        const v1 = new Vector(5, 5);
        const v2 = new Vector(2, 3);
        v1.sub(v2);
        expect(v1.x).toBe(3);
        expect(v1.y).toBe(2);
    });

    it('should multiply by a scalar', () => {
        const v = new Vector(2, 3);
        v.mult(2);
        expect(v.x).toBe(4);
        expect(v.y).toBe(6);
    });

    it('should divide by a scalar', () => {
        const v = new Vector(4, 6);
        v.div(2);
        expect(v.x).toBe(2);
        expect(v.y).toBe(3);
    });

    it('should handle division by zero safely', () => {
        const v = new Vector(4, 6);
        v.div(0);
        expect(v.x).toBe(4);
        expect(v.y).toBe(6);
    });

    it('should calculate magnitude', () => {
        const v = new Vector(3, 4);
        expect(v.mag()).toBe(5);
    });

    it('should set magnitude', () => {
        const v = new Vector(3, 4); // mag is 5
        v.setMag(10);
        expect(v.mag()).toBeCloseTo(10);
        expect(v.x).toBeCloseTo(6);
        expect(v.y).toBeCloseTo(8);
    });

    it('should normalize the vector', () => {
        const v = new Vector(3, 4);
        v.normalize();
        expect(v.mag()).toBeCloseTo(1);
        expect(v.x).toBeCloseTo(0.6);
        expect(v.y).toBeCloseTo(0.8);
    });

    it('should handle normalizing a zero vector safely', () => {
        const v = new Vector(0, 0);
        v.normalize();
        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('should limit magnitude', () => {
        const v = new Vector(3, 4); // mag is 5
        v.limit(2);
        expect(v.mag()).toBeCloseTo(2);
    });

    it('should not limit magnitude if below max', () => {
        const v = new Vector(3, 4); // mag is 5
        v.limit(10);
        expect(v.mag()).toBe(5);
    });

    it('should calculate distance squared', () => {
        const v1 = new Vector(1, 1);
        const v2 = new Vector(4, 5); // dx=3, dy=4 -> dist=5, distSq=25
        expect(v1.distSq(v2)).toBe(25);
    });

    it('should calculate distance', () => {
        const v1 = new Vector(1, 1);
        const v2 = new Vector(4, 5); // dx=3, dy=4 -> dist=5
        expect(v1.dist(v2)).toBe(5);
    });

    it('should copy the vector', () => {
        const v1 = new Vector(3, 4);
        const v2 = v1.copy();
        expect(v2).not.toBe(v1); // Different instance
        expect(v2.x).toBe(v1.x);
        expect(v2.y).toBe(v1.y);
    });

    describe('static methods', () => {
        it('should add two vectors', () => {
            const v1 = new Vector(1, 2);
            const v2 = new Vector(3, 4);
            const v3 = Vector.add(v1, v2);
            expect(v3.x).toBe(4);
            expect(v3.y).toBe(6);
            expect(v1.x).toBe(1); // Original unchanged
        });

        it('should subtract two vectors', () => {
            const v1 = new Vector(5, 5);
            const v2 = new Vector(2, 3);
            const v3 = Vector.sub(v1, v2);
            expect(v3.x).toBe(3);
            expect(v3.y).toBe(2);
            expect(v1.x).toBe(5); // Original unchanged
        });

        it('should divide a vector by a scalar', () => {
            const v1 = new Vector(4, 6);
            const v2 = Vector.div(v1, 2);
            expect(v2.x).toBe(2);
            expect(v2.y).toBe(3);
            expect(v1.x).toBe(4); // Original unchanged
        });

        it('should generate a random 2D vector', () => {
            const v = Vector.random2D();
            expect(v.mag()).toBeCloseTo(1);
        });
    });
});
