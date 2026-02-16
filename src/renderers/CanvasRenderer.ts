import { Boid } from '../core/Boid';
import { Noise } from '../core/Noise';

export type ShapeType = 'triangle' | 'circle' | 'line';

export class CanvasRenderer {
    constructor(private ctx: CanvasRenderingContext2D) { }

    clear(width: number, height: number) {
        this.ctx.clearRect(0, 0, width, height);
    }

    drawNoiseBackground(width: number, height: number, noise: Noise, scale: number, z: number) {
        const resolution = 20;
        for (let x = 0; x < width; x += resolution) {
            for (let y = 0; y < height; y += resolution) {
                const nx = x * scale;
                const ny = y * scale;
                const n = (noise.noise(nx, ny, z) + 1) * 0.5; // Map from [-1, 1] to [0, 1]
                const val = Math.floor(n * 255);
                this.ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
                this.ctx.fillRect(x, y, resolution, resolution);
            }
        }
    }

    drawFlowField(width: number, height: number, noise: Noise, scale: number, z: number, color: string) {
        const resolution = 20;
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;

        for (let x = 0; x < width; x += resolution) {
            for (let y = 0; y < height; y += resolution) {
                const nx = x * scale;
                const ny = y * scale;
                const angle = noise.noise(nx, ny, z) * Math.PI * 2 * 2;

                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(angle);
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(resolution * 0.5, 0);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
        this.ctx.restore();
    }

    drawBoid(boid: Boid, shape: ShapeType = 'triangle') {
        this.ctx.save();
        this.ctx.translate(boid.position.x, boid.position.y);
        this.ctx.rotate(Math.atan2(boid.velocity.y, boid.velocity.x));
        this.ctx.fillStyle = boid.color;

        switch (shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, boid.size, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'line':
                this.ctx.strokeStyle = boid.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(-boid.size, 0);
                this.ctx.lineTo(boid.size, 0);
                this.ctx.stroke();
                break;
            case 'triangle':
            default:
                this.ctx.beginPath();
                this.ctx.moveTo(boid.size, 0);
                this.ctx.lineTo(-boid.size, boid.size / 2);
                this.ctx.lineTo(-boid.size, -boid.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
        }
        this.ctx.restore();
    }
}
