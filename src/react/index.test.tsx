import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BoidsJS } from './index';
import { Engine } from '../core/Engine';

// Mock the Engine class
vi.mock('../core/Engine', () => {
    return {
        Engine: vi.fn().mockImplementation(function (this: any, options: any) {
            this.run = vi.fn();
            this.init = vi.fn();
            this.options = options || {};
            this.boids = [];
            this.predators = [];
        }),
    };
});

describe('BoidsJS React Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render a canvas element with default dimensions', () => {
        const { container } = render(<BoidsJS />);

        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveAttribute('width', '800');
        expect(canvas).toHaveAttribute('height', '600');
    });

    it('should render a canvas element with provided dimensions and props', () => {
        const { container } = render(
            <BoidsJS
                width={1024}
                height={768}
                className="my-boids"
                style={{ backgroundColor: 'black' }}
            />
        );

        const canvas = container.querySelector('canvas');
        expect(canvas).toHaveClass('my-boids');
        expect(canvas).toHaveStyle('background-color: rgb(0, 0, 0)');
        expect(canvas).toHaveAttribute('width', '1024');
        expect(canvas).toHaveAttribute('height', '768');
    });

    it('should initialize Engine on mount with default options', () => {
        render(<BoidsJS />);

        expect(Engine).toHaveBeenCalledTimes(1);
        const engineOptions = vi.mocked(Engine).mock.calls[0][0];

        expect(engineOptions.width).toBe(800);
        expect(engineOptions.boidCount).toBe(50);
        expect(engineOptions.algorithm).toBe('reynolds');
    });

    it('should update Engine options when props change', () => {
        const { rerender } = render(<BoidsJS boidCount={50} maxSpeed={4} />);

        // Get the mocked instance
        const mockEngineInstance = vi.mocked(Engine).mock.results[0].value;

        // Ensure options exist
        mockEngineInstance.options = {
            boidCount: 50,
            maxSpeed: 4
        };

        // Rerender with new props
        rerender(<BoidsJS boidCount={100} maxSpeed={6} />);

        // Check if the options on the instance were updated
        expect(mockEngineInstance.options.boidCount).toBe(100);
        expect(mockEngineInstance.options.maxSpeed).toBe(6);
    });

    it('should call init() when boidCount or predatorCount changes', () => {
        const { rerender } = render(<BoidsJS boidCount={50} />);

        const mockEngineInstance = vi.mocked(Engine).mock.results[0].value;

        // Mock current boids count to simulate state where count mismatch triggers init
        mockEngineInstance.boids = new Array(50);
        mockEngineInstance.predators = [];

        rerender(<BoidsJS boidCount={100} />);

        expect(mockEngineInstance.init).toHaveBeenCalled();
    });
});
