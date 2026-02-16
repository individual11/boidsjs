# BoidsJS

A highly customizable, lightweight, and performance-oriented library for boids (flocking) simulations. Built with TypeScript and optimized for both Vanilla JavaScript and React environments.

## Features

- **Multiple Algorithms**: Classic Reynolds flocking, optimized 7-nearest neighbor selection, and dynamic Flow Fields.
- **Environment Interaction**: Built-in support for predators and mouse interactions (attraction/repulsion).
- **Visualization Aids**: Integrated noise map rendering and flow line visualizations for debugging and aesthetics.
- **React Support**: First-class React wrapper component for seamless integration into modern web apps.
- **Performant**: Minimal overhead with zero dependencies for core logic.

## Installation

```bash
npm install boidsjs
# or
yarn add boidsjs
```

## Basic Usage (Vanilla JS)

```javascript
import { Engine } from 'boidsjs';

const canvas = document.getElementById('myCanvas');
const engine = new Engine({
  canvas: canvas,
  boidCount: 150,
  algorithm: 'reynolds',
  color: '#22d3ee'
});

engine.run();
```

## Advanced Config

The `Engine` constructor accepts a wide range of options:

### Core Configuration
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `canvas` | `HTMLCanvasElement` | - | **Required**. The canvas element to render on. |
| `width` | `number` | - | Width of the simulation area. |
| `height` | `number` | - | Height of the simulation area. |
| `boidCount` | `number` | `50` | Total number of boids in simulation. |
| `color` | `string` | `"#22d3ee"` | Color of the boids. |
| `shape` | `'triangle' \| 'circle' \| 'line'` | `'triangle'` | Visual shape of the boids. |
| `boidSize` | `number` | `5` | Size of the boids in pixels. |

### Physics & Behavior
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `algorithm` | `'reynolds' \| 'optimized' \| 'flow-field'` | `'reynolds'` | The flocking algorithm to use. |
| `maxSpeed` | `number` | `4` | Maximum velocity of a boid. |
| `minSpeed` | `number` | `2` | Minimum velocity of a boid. |
| `maxForce` | `number` | `0.1` | Stability/steering strength. |

### Interactions
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mouseInteraction` | `'none' \| 'attract' \| 'repulse'` | `'none'` | Mouse interaction mode. |
| `mouseRadius` | `number` | `150` | Influence radius for mouse interaction. |
| `predatorCount`| `number` | `0` | Number of predators to avoid. |

### Visual Aids (Flow Field)
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showFlowField` | `boolean` | `false` | Visualize the underlying flow lines. |
| `showNoiseBackground`| `boolean` | `false` | Visualize the underlying noise map. |
| `flowFieldColor` | `string` | `"rgba(255,255,255,0.1)"` | Color of the flow lines. |
| `noiseSpeed` | `number` | `0.005` | Evolution speed of the noise field. |

### Hooks & Callbacks
| Property | Type | Description |
| :--- | :--- | :--- |
| `onFrame` | `() => void` | Callback executed on every animation frame. |

## React Support

We provide a dedicated React component for easy integration:

```tsx
import { BoidsJS } from 'boidsjs/react';

const MyComponent = () => (
  <BoidsJS 
    boidCount={100} 
    algorithm="flow-field" 
    showFlowField={true} 
  />
);
```

For more details, see the [React Guide](./REACT_GUIDE.md).

## Development

```bash
# Install dependencies
yarn install

# Run demo app
yarn dev

# Build library
yarn build
```

## License

MIT
