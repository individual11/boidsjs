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

            if (reynoldsOptions) {
                e.options.reynoldsOptions = { ...e.options.reynoldsOptions, ...reynoldsOptions };
            }
            if (flowFieldOptions) {
                e.options.flowFieldOptions = { ...e.options.flowFieldOptions, ...flowFieldOptions };
            }

            if (e.boids.length !== boidCount || e.predators.length !== predatorCount) {
                e.options.predatorCount = predatorCount;
                e.init();
            }
        }
    }, [boidCount, algorithm, shape, boidSize, maxSpeed, minSpeed, maxForce, color, showFlowField, showNoiseBackground, noiseSpeed, flowFieldColor, mouseInteraction, mouseRadius, predatorCount, reynoldsOptions, flowFieldOptions]);

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
