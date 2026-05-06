import React, { useEffect, useRef } from 'react';
import { Engine, EngineOptions } from '../core/Engine';

export interface BoidsJSProps extends Partial<Omit<EngineOptions, 'canvas'>> {
    className?: string;
    style?: React.CSSProperties;
    onFrame?: () => void;
}

export const BoidsJS: React.FC<BoidsJSProps> = ({
    className,
    style,
    width = 800,
    height = 600,
    boidCount = 50,
    algorithm = 'reynolds',
    shape = 'triangle',
    boidSize = 5,
    maxSpeed = 4,
    maxForce = 0.1,
    color = '#22d3ee',
    showFlowField = false,
    showNoiseBackground = false,
    noiseSpeed = 0.005,
    mouseInteraction = 'none',
    mouseRadius = 150,
    predatorCount = 0,
    predatorOptions,
    reynoldsOptions,
    flowFieldOptions,
    flowFieldColor = 'rgba(255, 255, 255, 0.1)',
    minSpeed = 2,
    onFrame,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            engineRef.current = new Engine({
                canvas: canvasRef.current,
                width,
                height,
                boidCount,
                algorithm,
                shape,
                boidSize,
                maxSpeed,
                maxForce,
                color,
                showFlowField,
                showNoiseBackground,
                noiseSpeed,
                mouseInteraction,
                mouseRadius,
                predatorCount,
                predatorOptions,
                reynoldsOptions,
                flowFieldOptions,
                flowFieldColor,
                minSpeed,
                onFrame,
            });
            engineRef.current.run();
        }
    }, []);

    useEffect(() => {
        if (engineRef.current) {
            const e = engineRef.current;
            e.options.boidCount = boidCount;
            e.options.algorithm = algorithm;
            e.options.shape = shape;
            e.options.boidSize = boidSize;
            e.options.maxSpeed = maxSpeed;
            e.options.maxForce = maxForce;
            e.options.color = color;
            e.options.showFlowField = showFlowField;
            e.options.showNoiseBackground = showNoiseBackground;
            e.options.noiseSpeed = noiseSpeed;
            e.options.mouseInteraction = mouseInteraction;
            e.options.mouseRadius = mouseRadius;
            e.options.minSpeed = minSpeed;
            e.options.flowFieldColor = flowFieldColor;

            e.options.reynoldsOptions = {
                perceptionRadius: reynoldsOptions?.perceptionRadius ?? 50,
                alignmentWeight: reynoldsOptions?.alignmentWeight ?? 1.0,
                cohesionWeight: reynoldsOptions?.cohesionWeight ?? 1.0,
                separationWeight: reynoldsOptions?.separationWeight ?? 1.0,
            };

            e.options.flowFieldOptions = {
                scale: flowFieldOptions?.scale ?? 0.003,
                strength: flowFieldOptions?.strength ?? 0.25,
                timeShift: flowFieldOptions?.timeShift ?? 1,
            };

            e.options.predatorOptions = {
                color: predatorOptions?.color ?? '#ef4444',
                speed: predatorOptions?.speed ?? 3,
                size: predatorOptions?.size ?? 7.5,
                fleeRadius: predatorOptions?.fleeRadius ?? 100,
                shape: predatorOptions?.shape ?? 'triangle',
            };

            if (e.boids.length !== boidCount || e.predators.length !== predatorCount) {
                e.options.predatorCount = predatorCount;
                e.init();
            }
        }
    }, [boidCount, algorithm, shape, boidSize, maxSpeed, minSpeed, maxForce, color, showFlowField, showNoiseBackground, noiseSpeed, flowFieldColor, mouseInteraction, mouseRadius, predatorCount, predatorOptions, reynoldsOptions, flowFieldOptions]);

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.options.width = width;
            engineRef.current.options.height = height;
        }
    }, [width, height]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: 'block', ...style }}
            width={width}
            height={height}
        />
    );
};
