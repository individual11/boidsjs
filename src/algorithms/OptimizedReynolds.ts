import { Boid } from '../core/Boid';
import { Reynolds, ReynoldsOptions } from './Reynolds';

// based on Princeton study -> https://www.princeton.edu/news/2013/02/07/birds-feather-track-seven-neighbors-flock-together
export class OptimizedReynolds extends Reynolds {
    static flock(boid: Boid, neighbors: Boid[], options: ReynoldsOptions): void {
        // Only use the 6 nearest neighbors
        const nearest = [...neighbors]
            .filter((other) => other !== boid)
            .sort((a, b) => boid.position.dist(a.position) - boid.position.dist(b.position))
            .slice(0, 7);

        super.flock(boid, nearest, options);
    }
}
