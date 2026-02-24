import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Engine, EngineOptions } from './Engine';

describe('Engine', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockCtx: any;

    beforeEach(() => {
        // Simple mock of canvas context
        mockCtx = {
            clearRect: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            beginPath: vi.fn(),
            closePath: vi.fn(),
            arc: vi.fn(),
            fillRect: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            fill: vi.fn(),
            stroke: vi.fn(),
            putImageData: vi.fn(),
            createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(100) })),
            fillStyle: '',
            strokeStyle: '',
            globalAlpha: 1,
        } as any;

        mockCanvas = document.createElement('canvas');
        mockCanvas.width = 800;
        mockCanvas.height = 600;

        // Mock getContext to return our mock
        vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockCtx);
    });

    it('should initialize with default options', () => {
        const options: EngineOptions = {
            canvas: mockCanvas,
            width: 800,
            height: 600,
            boidCount: 10
        };

        const engine = new Engine(options);

        expect(engine.boids.length).toBe(10);
        expect(engine.predators.length).toBe(0);
        expect(engine.options.algorithm).toBe('reynolds');
        expect(engine.options.shape).toBe('triangle');
        expect(engine.options.boidSize).toBe(5);
        expect(engine.options.maxSpeed).toBe(4);
    });

    it('should initialize with provided overrides', () => {
        const options: EngineOptions = {
            canvas: mockCanvas,
            width: 800,
            height: 600,
            boidCount: 5,
            predatorCount: 2,
            algorithm: 'flow-field',
            shape: 'circle',
            boidSize: 10,
        };

        const engine = new Engine(options);

        expect(engine.boids.length).toBe(5);
        expect(engine.predators.length).toBe(2);
        expect(engine.options.algorithm).toBe('flow-field');
        expect(engine.options.shape).toBe('circle');
        expect(engine.options.boidSize).toBe(10);
    });

    it('should update boid positions when update() is called', () => {
        const engine = new Engine({
            canvas: mockCanvas,
            width: 800,
            height: 600,
            boidCount: 1,
            algorithm: 'reynolds'
        });

        const boid = engine.boids[0];
        const initialPos = boid.position.copy();

        engine.update();

        // Velocity should have changed position
        expect(boid.position.x).not.toBe(initialPos.x);
        expect(boid.position.y).not.toBe(initialPos.y);
    });

    it('should re-initialize boids when init() is called', () => {
        const engine = new Engine({
            canvas: mockCanvas,
            width: 800,
            height: 600,
            boidCount: 5
        });

        const originalBoids = engine.boids;

        // Change count and re-init
        engine.options.boidCount = 10;
        engine.init();

        expect(engine.boids.length).toBe(10);
        expect(engine.boids).not.toBe(originalBoids);
    });

    it('should call renderer clear and draw methods when render() is called', () => {
        const engine = new Engine({
            canvas: mockCanvas,
            width: 800,
            height: 600,
            boidCount: 2,
            predatorCount: 1
        });

        const clearSpy = vi.spyOn(engine.renderer, 'clear');
        const drawBoidSpy = vi.spyOn(engine.renderer, 'drawBoid');

        engine.render();

        expect(clearSpy).toHaveBeenCalledWith(800, 600);
        // drawn for each boid (2) and predator (1)
        expect(drawBoidSpy).toHaveBeenCalledTimes(3);
    });
});
