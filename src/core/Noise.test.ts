import { describe, it, expect } from 'vitest';
import { Noise } from './Noise';

describe('Noise', () => {
    it('should initialize and create permutation array', () => {
        const noise = new Noise();
        expect(noise).toBeDefined();
    });

    it('should generate consistent noise for the same coordinates', () => {
        const noise = new Noise();
        const n1 = noise.noise(1.5, 2.5, 3.5);
        const n2 = noise.noise(1.5, 2.5, 3.5);
        expect(n1).toBe(n2);
    });

    it('should generate different noise for different coordinates', () => {
        const noise = new Noise();
        const n1 = noise.noise(1.5, 2.5, 3.5);
        const n2 = noise.noise(1.6, 2.5, 3.5);
        expect(n1).not.toBe(n2);
    });

    it('should generate noise when y and z are omitted', () => {
        const noise = new Noise();
        const n = noise.noise(1.5);
        expect(typeof n).toBe('number');
        expect(n).not.toBeNaN();
    });

    it('should generate noise within expected bounds (-1 to 1 roughly)', () => {
        const noise = new Noise();
        let max = -Infinity;
        let min = Infinity;

        // Sample a few points to check bounds
        for (let i = 0; i < 100; i++) {
            const val = noise.noise(i * 0.1, i * 0.2, i * 0.3);
            if (val > max) max = val;
            if (val < min) min = val;

            // Perlin noise theoretically ranges from -1 to 1 (often narrower depending on impl)
            expect(val).toBeGreaterThanOrEqual(-1);
            expect(val).toBeLessThanOrEqual(1);
        }
    });
});
