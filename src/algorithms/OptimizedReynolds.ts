import { Boid } from '../core/Boid';
import { Reynolds, ReynoldsOptions } from './Reynolds';

// based on Princeton study -> https://www.princeton.edu/news/2013/02/07/birds-feather-track-seven-neighbors-flock-together
export class OptimizedReynolds extends Reynolds {
    static flock(boid: Boid, neighbors: Boid[], options: ReynoldsOptions): void {
        const radiusSq = options.perceptionRadius * options.perceptionRadius;

        const nearest = neighbors
            .filter((other) => {
                if (other === boid) {
                    return false;
                }
                return boid.position.distSq(other.position) < radiusSq;
            })
            .sort((a, b) => boid.position.distSq(a.position) - boid.position.distSq(b.position))
            .slice(0, 7);

        super.flock(boid, nearest, options);
    }
}
