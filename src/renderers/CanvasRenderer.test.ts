import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CanvasRenderer } from './CanvasRenderer';
import { Boid } from '../core/Boid';
import { Vector } from '../core/Vector';

describe('CanvasRenderer', () => {
    let mockCtx: any;
    let renderer: CanvasRenderer;

    beforeEach(() => {
        mockCtx = {
            clearRect: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            fill: vi.fn(),
            stroke: vi.fn(),
            arc: vi.fn(),
            closePath: vi.fn(),
            fillRect: vi.fn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1
        };

        renderer = new CanvasRenderer(mockCtx);
    });

    it('should call clearRect on clear', () => {
        renderer.clear(800, 600);
        expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    describe('drawBoid', () => {
        let boid: Boid;

        beforeEach(() => {
            boid = new Boid({
                position: new Vector(100, 150),
                velocity: new Vector(1, 1), // Atan2(1,1) = 45 deg
                acceleration: new Vector(0, 0),
                maxSpeed: 4, minSpeed: 1, maxForce: 0.1, size: 10, color: 'red'
            });
        });

        it('should setup transform before drawing', () => {
            renderer.drawBoid(boid, 'triangle');

            expect(mockCtx.save).toHaveBeenCalled();
            expect(mockCtx.translate).toHaveBeenCalledWith(100, 150);
            expect(mockCtx.rotate).toHaveBeenCalledWith(Math.atan2(1, 1));
            expect(mockCtx.fillStyle).toBe('red');
            expect(mockCtx.restore).toHaveBeenCalled();
        });

        it('should draw a triangle by default', () => {
            renderer.drawBoid(boid, 'triangle');

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 0); // boid.size, 0
            expect(mockCtx.lineTo).toHaveBeenCalledWith(-10, 5); // -boid.size, size/2
            expect(mockCtx.lineTo).toHaveBeenCalledWith(-10, -5); // -boid.size, -size/2
            expect(mockCtx.closePath).toHaveBeenCalled();
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        it('should draw a circle', () => {
            renderer.drawBoid(boid, 'circle');

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.arc).toHaveBeenCalledWith(0, 0, 10, 0, Math.PI * 2);
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        it('should draw a line', () => {
            renderer.drawBoid(boid, 'line');

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.strokeStyle).toBe('red');
            expect(mockCtx.lineWidth).toBe(2);
            expect(mockCtx.moveTo).toHaveBeenCalledWith(-10, 0);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(10, 0);
            expect(mockCtx.stroke).toHaveBeenCalled();
        });
    });
});
