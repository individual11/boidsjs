import React, { useState, useMemo, useEffect } from 'react';
import { BoidsJS } from '../src/react';
import Stats from 'stats.js';

const DEFAULTS = {
    count: 100,
    algorithm: 'reynolds' as const,
    shape: 'triangle' as const,
    size: 5,
    speed: 4,
    minSpeed: 2,
    force: 0.1,
    color: '#22d3ee',
    showFlowField: false,
    showNoiseBackground: false,
    noiseScale: 0.003,
    noiseSpeed: 0.003,
    flowStrength: 0.25,
    flowColor: '#ffffff',
    flowOpacity: 0.1,
    mouseMode: 'none' as const,
    predators: 0,
    sep: 1.0,
    align: 1.0,
    coh: 1.0,
    radius: 50
};

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div style={{ marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 4px',
                    cursor: 'pointer',
                    background: isOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderRadius: '4px'
                }}
            >
                <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{title}</h3>
                <span style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    fontSize: '0.7rem'
                }}>▼</span>
            </div>
            {isOpen && (
                <div style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export const App = () => {
    const [count, setCount] = useState(100);
    const [algorithm, setAlgorithm] = useState<'reynolds' | 'flow-field' | 'optimized'>('reynolds');
    const [shape, setShape] = useState<'triangle' | 'circle' | 'line'>('triangle');
    const [size, setSize] = useState(5);
    const [speed, setSpeed] = useState(4);
    const [minSpeed, setMinSpeed] = useState(2);
    const [force, setForce] = useState(0.1);
    const [color, setColor] = useState('#22d3ee');
    const [showFlowField, setShowFlowField] = useState(false);
    const [showNoiseBackground, setShowNoiseBackground] = useState(false);
    const [noiseScale, setNoiseScale] = useState(0.003);
    const [noiseSpeed, setNoiseSpeed] = useState(0.003);
    const [flowStrength, setFlowStrength] = useState(0.25);
    const [flowColor, setFlowColor] = useState('#ffffff');
    const [flowOpacity, setFlowOpacity] = useState(0.1);
    const [mouseMode, setMouseMode] = useState<'none' | 'attract' | 'repulse'>('none');
    const [predators, setPredators] = useState(0);

    // Reynolds options
    const [sep, setSep] = useState(1.0);
    const [align, setAlign] = useState(1.0);
    const [coh, setCoh] = useState(1.0);
    const [radius, setRadius] = useState(50);

    const handleReset = () => {
        setCount(DEFAULTS.count);
        setAlgorithm(DEFAULTS.algorithm);
        setShape(DEFAULTS.shape);
        setSize(DEFAULTS.size);
        setSpeed(DEFAULTS.speed);
        setMinSpeed(DEFAULTS.minSpeed);
        setForce(DEFAULTS.force);
        setColor(DEFAULTS.color);
        setShowFlowField(DEFAULTS.showFlowField);
        setShowNoiseBackground(DEFAULTS.showNoiseBackground);
        setNoiseScale(DEFAULTS.noiseScale);
        setNoiseSpeed(DEFAULTS.noiseSpeed);
        setFlowStrength(DEFAULTS.flowStrength);
        setFlowColor(DEFAULTS.flowColor);
        setFlowOpacity(DEFAULTS.flowOpacity);
        setMouseMode(DEFAULTS.mouseMode);
        setPredators(DEFAULTS.predators);
        setSep(DEFAULTS.sep);
        setAlign(DEFAULTS.align);
        setCoh(DEFAULTS.coh);
        setRadius(DEFAULTS.radius);
    };

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const windowSize = useMemo(() => ({ width: window.innerWidth, height: window.innerHeight }), []);

    const stats = useMemo(() => new Stats(), []);

    useEffect(() => {
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.dom.style.position = 'fixed';
        stats.dom.style.left = 'auto';
        stats.dom.style.right = '0px';
        stats.dom.style.top = '0px';
        document.body.appendChild(stats.dom);
        return () => {
            document.body.removeChild(stats.dom);
        };
    }, [stats]);

    useEffect(() => {
        if (algorithm !== 'flow-field') {
            setShowNoiseBackground(false);
            setShowFlowField(false);
        }
    }, [algorithm]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <BoidsJS
                boidCount={count}
                width={windowSize.width}
                height={windowSize.height}
                algorithm={algorithm}
                shape={shape}
                boidSize={size}
                maxSpeed={speed}
                minSpeed={minSpeed}
                maxForce={force}
                color={color}
                showFlowField={showFlowField}
                showNoiseBackground={showNoiseBackground}
                noiseSpeed={noiseSpeed}
                flowFieldColor={hexToRgba(flowColor, flowOpacity)}
                mouseInteraction={mouseMode}
                predatorCount={predators}
                onFrame={() => stats.update()}
                flowFieldOptions={{
                    scale: noiseScale,
                    strength: flowStrength
                }}
                reynoldsOptions={{
                    separationWeight: sep,
                    alignmentWeight: align,
                    cohesionWeight: coh,
                    perceptionRadius: radius
                }}
            />

            <div className="controls" style={{ maxHeight: '95vh', overflowY: 'auto', width: '280px', padding: '12px' }}>
                <h1 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#22d3ee', textAlign: 'center' }}>BoidsJS Labs</h1>

                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>

                    <Accordion title="Core" defaultOpen>
                        <label>Count: {count} <input type="range" min="1" max="1000" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={count} onChange={(e) => setCount(parseInt(e.target.value))} /></label>
                        <label>Size: {size} <input type="range" min="1" max="20" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={size} onChange={(e) => setSize(parseInt(e.target.value))} /></label>
                        <label>Color: <input type="color" style={{ width: '100%', height: '24px', border: 'none', background: 'none' }} value={color} onChange={(e) => setColor(e.target.value)} /></label>
                    </Accordion>

                    <Accordion title="Physics">
                        <label>Max Speed: {speed.toFixed(1)} <input type="range" min="0" max="20" step="0.5" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={speed} onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSpeed(val);
                            if (val < minSpeed) {
                                setMinSpeed(val);
                            }
                        }} /></label>
                        <label>Min Speed: {minSpeed.toFixed(1)} <input type="range" min="0" max="10" step="0.5" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={minSpeed} onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setMinSpeed(Math.min(val, speed));
                        }} /></label>
                        <label>Max Force: {force.toFixed(2)} <input type="range" min="0.01" max="1" step="0.01" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={force} onChange={(e) => setForce(parseFloat(e.target.value))} /></label>
                    </Accordion>

                    <Accordion title="Behavior Tuning">
                        <label>Separation: {sep.toFixed(1)} <input type="range" min="0" max="5" step="0.1" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={sep} onChange={(e) => setSep(parseFloat(e.target.value))} /></label>
                        <label>Alignment: {align.toFixed(1)} <input type="range" min="0" max="5" step="0.1" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={align} onChange={(e) => setAlign(parseFloat(e.target.value))} /></label>
                        <label>Cohesion: {coh.toFixed(1)} <input type="range" min="0" max="5" step="0.1" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={coh} onChange={(e) => setCoh(parseFloat(e.target.value))} /></label>
                        <label>Perception: {radius} <input type="range" min="10" max="200" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} /></label>
                    </Accordion>

                    <Accordion title="Environment">
                        <label>Predators: {predators} <input type="range" min="0" max="10" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={predators} onChange={(e) => setPredators(parseInt(e.target.value))} /></label>
                        <label>Mouse Interaction:
                            <select style={{ width: '100%', background: '#334155', color: 'white', border: 'none', padding: '4px', fontSize: '0.8rem', borderRadius: '4px' }} value={mouseMode} onChange={(e) => setMouseMode(e.target.value as any)}>
                                <option value="none">None</option>
                                <option value="attract">Attract</option>
                                <option value="repulse">Repulse</option>
                            </select>
                        </label>
                    </Accordion>

                    <Accordion title="Algorithm & Style" defaultOpen>
                        <select style={{ width: '100%', background: '#334155', color: 'white', border: 'none', padding: '4px', fontSize: '0.8rem', borderRadius: '4px' }} value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)}>
                            <option value="reynolds">Reynolds</option>
                            <option value="optimized">7-Nearest</option>
                            <option value="flow-field">Flow Field</option>
                        </select>
                        {algorithm === 'flow-field' && (
                            <label>Strength: {flowStrength.toFixed(2)} <input type="range" min="0.01" max="0.5" step="0.01" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={flowStrength} onChange={(e) => setFlowStrength(parseFloat(e.target.value))} /></label>
                        )}
                        <select style={{ width: '100%', background: '#334155', color: 'white', border: 'none', padding: '4px', marginTop: '4px', fontSize: '0.8rem', borderRadius: '4px' }} value={shape} onChange={(e) => setShape(e.target.value as any)}>
                            <option value="triangle">Triangle</option>
                            <option value="circle">Circle</option>
                            <option value="line">Line</option>
                        </select>
                    </Accordion>

                    {algorithm === 'flow-field' && (
                        <Accordion title="Noise & Visuals">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input type="checkbox" checked={showNoiseBackground} onChange={(e) => setShowNoiseBackground(e.target.checked)} /> Show Noise Map
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input type="checkbox" checked={showFlowField} onChange={(e) => setShowFlowField(e.target.checked)} /> Show Flow Lines
                                </label>
                            </div>
                            {showFlowField && (
                                <>
                                    <label>Scale: {noiseScale.toFixed(4)} <input type="range" min="0.0001" max="0.05" step="0.0001" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={noiseScale} onChange={(e) => setNoiseScale(parseFloat(e.target.value))} /></label>
                                    <label>Evolution: {noiseSpeed.toFixed(4)} <input type="range" min="0" max="0.05" step="0.001" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={noiseSpeed} onChange={(e) => setNoiseSpeed(parseFloat(e.target.value))} /></label>
                                    <label>Flow Color: <input type="color" style={{ width: '100%', height: '24px', border: 'none', background: 'none' }} value={flowColor} onChange={(e) => setFlowColor(e.target.value)} /></label>
                                    <label>Flow Opacity: {flowOpacity.toFixed(2)} <input type="range" min="0" max="1" step="0.01" style={{ width: '100%', height: '12px', margin: '2px 0' }} value={flowOpacity} onChange={(e) => setFlowOpacity(parseFloat(e.target.value))} /></label>
                                </>
                            )}
                        </Accordion>
                    )}

                    <button
                        onClick={handleReset}
                        style={{
                            marginTop: '16px',
                            padding: '10px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                    >
                        Reset to Defaults
                    </button>

                </div>
            </div>
        </div>
    );
};
