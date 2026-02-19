# BoidsJS React Guide

The `BoidsJS` component is the easiest way to add a boids simulation to your React application. It handles engine initialization, resizing, and provides a declarative API for configuring the simulation.

## Basic Usage

```tsx
import { BoidsJS } from '@individual11/boidsjs/react';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <BoidsJS 
        boidCount={200}
        color="#22d3ee"
      />
    </div>
  );
}
```

## Props

The `BoidsJS` component accepts the following props:

### Core Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `boidCount` | `number` | `50` | Number of boids in the simulation. |
| `width` | `number` | `800` | Width of the canvas. |
| `height` | `number` | `600` | Height of the canvas. |
| `color` | `string` | `"#22d3ee"` | Color of the boids. |
| `shape` | `'triangle' \| 'circle' \| 'line'` | `'triangle'` | Visual shape of the boids. |
| `boidSize` | `number` | `5` | Size of the boids. |

### Physics & Behavior
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `algorithm` | `'reynolds' \| 'optimized' \| 'flow-field'` | `'reynolds'` | The flocking algorithm to use. |
| `maxSpeed` | `number` | `4` | Maximum speed of boids. |
| `minSpeed` | `number` | `2` | Minimum speed of boids. |
| `maxForce` | `number` | `0.1` | Steering force strength. |
| `reynoldsOptions` | `object` | - | [Details below](#advanced-algorithm-options) |
| `flowFieldOptions` | `object` | - | [Details below](#advanced-algorithm-options) |

### Interactions
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mouseInteraction` | `'none' \| 'attract' \| 'repulse'` | `'none'` | Mouse interaction mode. |
| `mouseRadius` | `number` | `150` | Influence radius for mouse interaction. |
| `predatorCount` | `number` | `0` | Number of specialized "predator" boids. |

### Visual Aids (Flow Field)
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showFlowField` | `boolean` | `false` | Visualize the underlying flow lines. |
| `showNoiseBackground`| `boolean` | `false` | Visualize the underlying noise map. |
| `flowFieldColor` | `string` | `"rgba(255,255,255,0.1)"` | Color of the flow lines. |
| `noiseSpeed` | `number` | `0.003` | Evolution speed of the noise field. |

## Hooks & Callbacks
| Prop | Type | Description |
| :--- | :--- | :--- |
| `onFrame` | `() => void` | Callback executed on every animation frame. Useful for stats or external syncing. |

## Advanced Algorithm Options

### Reynolds Options (`reynoldsOptions`)
Used when `algorithm` is `'reynolds'` or `'optimized'`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `perceptionRadius` | `number` | `50` | Neighbor detection radius. |
| `alignmentWeight` | `number` | `1.0` | Strength of speed matching. |
| `cohesionWeight` | `number` | `1.0` | Strength of group centering. |
| `separationWeight` | `number` | `1.0` | Strength of collision avoidance. |

### Flow Field Options (`flowFieldOptions`)
Used when `algorithm` is `'flow-field'`.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `scale` | `number` | `0.003` | Noise map zoom level. |
| `strength` | `number` | `0.25` | Steering impact. |

## Example: Advanced Configuration

```tsx
<BoidsJS
  boidCount={300}
  algorithm="optimized"
  maxSpeed={6}
  mouseInteraction="repulse"
  reynoldsOptions={{
    separationWeight: 2.0,
    alignmentWeight: 1.0,
    cohesionWeight: 1.5,
    perceptionRadius: 50
  }}
/>
```

## Performance Tips

1. **Memoization**: While the component is efficient, try to avoid passing new object literals to `reynoldsOptions` or `flowFieldOptions` on every render if they haven't changed.
2. **Container Size**: The component will use the `width` and `height` props for the canvas. Ensure the parent container matches these dimensions for the best look.
