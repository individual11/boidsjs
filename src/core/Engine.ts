import { Boid } from './Boid';
import { Vector } from './Vector';
import { Reynolds, ReynoldsOptions } from '../algorithms/Reynolds';
import { FlowField, FlowFieldOptions } from '../algorithms/FlowField';
import { OptimizedReynolds } from '../algorithms/OptimizedReynolds';
import { Interactions } from '../algorithms/Interactions';
import { CanvasRenderer, ShapeType } from '../renderers/CanvasRenderer';
import { Noise } from './Noise';

export type AlgorithmType = 'reynolds' | 'flow-field' | 'optimized';
export type InteractionMode = 'repulse' | 'attract' | 'none';

export interface EngineOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    boidCount: number;
    algorithm?: AlgorithmType;
    shape?: ShapeType;
    reynoldsOptions?: ReynoldsOptions;
    flowFieldOptions?: FlowFieldOptions;
    showFlowField?: boolean;
    showNoiseBackground?: boolean;
    noiseSpeed?: number;
    flowFieldColor?: string;
    boidSize?: number;
    maxSpeed?: number;
    minSpeed?: number;
    maxForce?: number;
    color?: string;
    mouseInteraction?: InteractionMode;
    mouseRadius?: number;
    predatorCount?: number;
    onFrame?: () => void;
}

export class Engine {
    boids: Boid[] = [];
    predators: Boid[] = [];
    ctx: CanvasRenderingContext2D;
    renderer: CanvasRenderer;
    flowFieldControl = new FlowField();
    noise = new Noise();
    mouse = new Vector(-1000, -1000);
    noiseZ = 0;

    constructor(public options: EngineOptions) {
        this.ctx = options.canvas.getContext('2d')!;
        this.renderer = new CanvasRenderer(this.ctx);

        // Default options
        this.options.algorithm = options.algorithm || 'reynolds';
        this.options.shape = options.shape || 'triangle';
        this.options.boidSize = options.boidSize || 5;
        this.options.maxSpeed = options.maxSpeed ?? 4;
        this.options.minSpeed = options.minSpeed ?? 2;
        this.options.maxForce = options.maxForce ?? 0.1;
        this.options.color = options.color ?? '#22d3ee';
        this.options.showFlowField = options.showFlowField ?? false;
        this.options.showNoiseBackground = options.showNoiseBackground ?? false;
        this.options.noiseSpeed = options.noiseSpeed ?? 0.003;
        this.options.flowFieldColor = options.flowFieldColor ?? 'rgba(255, 255, 255, 0.1)';
        this.options.mouseInteraction = options.mouseInteraction ?? 'none';
        this.options.mouseRadius = options.mouseRadius ?? 150;
        this.options.predatorCount = options.predatorCount ?? 0;

        this.options.reynoldsOptions = options.reynoldsOptions || {
            perceptionRadius: 50,
            alignmentWeight: 1.0,
            cohesionWeight: 1.0,
            separationWeight: 1.0,
        };
        this.options.flowFieldOptions = options.flowFieldOptions || {
            scale: 0.003,
            strength: 0.25,
        };

        this.setupEventListeners();
        this.init();
    }

    private setupEventListeners() {
        this.options.canvas.addEventListener('mousemove', (e) => {
            const rect = this.options.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.options.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    init() {
        this.boids = [];
        for (let i = 0; i < this.options.boidCount; i++) {
            this.boids.push(this.createBoid(this.options.color!));
        }

        this.predators = [];
        for (let i = 0; i < this.options.predatorCount!; i++) {
            const pred = this.createBoid('#ef4444');
            pred.maxSpeed *= 0.8; // Predators are a bit slower but persistent
            pred.size *= 1.5;
            this.predators.push(pred);
        }
    }

    private createBoid(color: string): Boid {
        return new Boid({
            position: new Vector(Math.random() * this.options.width, Math.random() * this.options.height),
            velocity: Vector.random2D().mult(Math.random() * 2 + 2),
            acceleration: new Vector(),
            maxSpeed: this.options.maxSpeed!,
            minSpeed: this.options.minSpeed!,
            maxForce: this.options.maxForce!,
            size: this.options.boidSize!,
            color: color,
        });
    }

    update() {
        // Update normal boids
        for (const boid of this.boids) {
            if (this.options.algorithm === 'reynolds') {
                Reynolds.flock(boid, this.boids, this.options.reynoldsOptions!);
            } else if (this.options.algorithm === 'optimized') {
                OptimizedReynolds.flock(boid, this.boids, this.options.reynoldsOptions!);
            } else if (this.options.algorithm === 'flow-field') {
                this.flowFieldControl.apply(boid, this.noise, this.options.flowFieldOptions!, this.noiseZ);
            }

            // Mouse interactions
            if (this.options.mouseInteraction === 'repulse') {
                Interactions.flee(boid, [{ position: this.mouse } as any], this.options.mouseRadius!);
            } else if (this.options.mouseInteraction === 'attract') {
                Interactions.seek(boid, [this.mouse], this.options.mouseRadius!);
            }

            // Predator interactions
            if (this.predators.length > 0) {
                Interactions.flee(boid, this.predators, 100);
            }

            boid.edges(this.options.width, this.options.height);

            // Keep boids updated with current engine-wide settings
            boid.maxSpeed = this.options.maxSpeed!;
            boid.minSpeed = this.options.minSpeed!;
            boid.maxForce = this.options.maxForce!;
            boid.size = this.options.boidSize!;
            boid.color = this.options.color!;

            boid.update();
        }

        // Update predators
        for (const pred of this.predators) {
            // Predators hunt the nearest boid
            Interactions.seek(pred, this.boids.map(b => b.position), 500);

            // Simple separation among predators
            Reynolds.separation(pred, this.predators, 50).mult(2);

            pred.edges(this.options.width, this.options.height);
            pred.update();
        }

        this.noiseZ += this.options.noiseSpeed!;
    }

    render() {
        this.renderer.clear(this.options.width, this.options.height);

        if (this.options.showNoiseBackground) {
            this.renderer.drawNoiseBackground(
                this.options.width,
                this.options.height,
                this.noise,
                this.options.flowFieldOptions!.scale,
                this.noiseZ
            );
        }

        if (this.options.showFlowField) {
            this.renderer.drawFlowField(
                this.options.width,
                this.options.height,
                this.noise,
                this.options.flowFieldOptions!.scale,
                this.noiseZ,
                this.options.flowFieldColor!
            );
        }

        for (const boid of this.boids) {
            this.renderer.drawBoid(boid, this.options.shape);
        }

        for (const pred of this.predators) {
            this.renderer.drawBoid(pred, this.options.shape);
        }
    }

    run() {
        this.update();
        this.render();
        if (this.options.onFrame) {
            this.options.onFrame();
        }
        requestAnimationFrame(() => this.run());
    }
}
