/**
 * NetworkScene3D.tsx - High-readability 3D drinking-water network digital twin.
 *
 * Uses the exact 4-color brand palette:
 *   #FDF4AF (Solar Light) - Sensor alerts, optimal sampling beacon, active step highlights
 *   #A5E9DD (Aquamarine)  - Healthy flowing drinking water, telemetry glow, readable badges
 *   #6FBEB2 (Medium Teal) - Sub-sector junctions, branch pipelines, safe states, borders
 *   #34908B (Deep Teal)   - Storage tanks (R1, R2), core distribution trunks, primary controls
 *   #FF5C5C (Crimson)     - Verified contamination alarms
 */

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../state/appStore';
import type { NodeModel, EdgeModel } from '../../api/types';
import { RotateCcw, Layers } from 'lucide-react';

// Exact 4-color palette tokens from user reference
const COLOR_DEEP_TEAL = '#34908B';   // Reservoirs & primary trunks (Band 4)
const COLOR_MID_TEAL = '#6FBEB2';    // Sub-sector junctions & branch pipes (Band 3)
const COLOR_LIGHT_CYAN = '#A5E9DD';  // Active clean water, telemetry glow (Band 2)
const COLOR_YELLOW = '#FDF4AF';      // Solar highlight & sensor alert (Band 1)
const COLOR_CRIMSON = '#FF5C5C';     // Contamination confirmed
const COLOR_MUTED = '#1E474F';       // Unmeasured nodes
const COLOR_BG = '#081416';          // Clean oceanic basemap background

// Coordinate transformation: Maps 2D layout (x:100-900, y:80-840) to 3D world
const to3D = (x: number, y: number, elev: number = 220): [number, number, number] => {
  const wx = (x - 500) * 0.055;
  const wz = (y - 460) * 0.055;
  // Natural elevation slope matching hydraulic gravity head
  const wy = Math.max(0.6, (elev - 180) * 0.026);
  return [wx, wy, wz];
};

// -------------------------------------------------------------
// Control-Room Digital Basemap with Tech Grid Lines
// -------------------------------------------------------------
const TechBasemap: React.FC = () => {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Dark ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color="#040A0C"
          roughness={0.95}
          metalness={0.2}
        />
      </mesh>

      {/* Grid coordinate helper */}
      <gridHelper
        args={[80, 40, '#34908B', '#0E2A2E']}
        position={[0, 0.01, 0]}
      />
    </group>
  );
};

// -------------------------------------------------------------
// Interactive 3D Node Object with Always-Readable High-Contrast Badges
// -------------------------------------------------------------
interface Node3DProps {
  node: NodeModel;
  position: [number, number, number];
  reading?: { value: number; is_alert: boolean };
  candidate?: { probability: number; rank: number };
  isRecommended: boolean;
  isSampled: boolean;
  sampleVal?: number;
  isSelected: boolean;
  isTrueSourceRevealed: boolean;
  isInTrueSpread: boolean;
  showLabels: boolean;
  onClick: (nodeId: string) => void;
  onDoubleClick: (pos: [number, number, number]) => void;
}

const Node3D: React.FC<Node3DProps> = ({
  node,
  position,
  reading,
  candidate,
  isRecommended,
  isSampled,
  sampleVal,
  isSelected,
  isTrueSourceRevealed,
  isInTrueSpread,
  showLabels,
  onClick,
  onDoubleClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);

  const isAlert = Boolean(reading?.is_alert || (sampleVal && sampleVal >= 230));

  // Determine vibrant node color based on hydraulic state
  const nodeColor = useMemo(() => {
    if (isTrueSourceRevealed) return COLOR_CRIMSON;
    if (isAlert) return COLOR_YELLOW;
    if (node.type === 'reservoir') return COLOR_DEEP_TEAL;
    if (reading || isSampled) return COLOR_LIGHT_CYAN;
    if (node.type === 'zone') return COLOR_MID_TEAL;
    return COLOR_MUTED;
  }, [node.type, reading, isSampled, isAlert, isTrueSourceRevealed]);

  // Pulse animation for alerts or candidates
  useFrame(({ clock }) => {
    if (ringRef.current && (candidate || isRecommended || isAlert)) {
      const t = clock.getElapsedTime();
      const s = 1 + Math.sin(t * 3.5) * 0.16;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      position={position}
      onClick={e => {
        e.stopPropagation();
        onClick(node.id);
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        onDoubleClick(position);
      }}
      onPointerOver={e => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pillar anchoring node down to grid floor */}
      <mesh position={[0, -position[1] / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, position[1], 8]} />
        <meshBasicMaterial color="#1E474F" transparent opacity={0.35} />
      </mesh>

      {/* Outer Pulse Halo for Candidate or Alert */}
      {(candidate || isRecommended || isAlert) && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.4, 32]} />
          <meshBasicMaterial
            color={isTrueSourceRevealed ? COLOR_CRIMSON : isAlert ? COLOR_YELLOW : COLOR_LIGHT_CYAN}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Primary 3D Node Mesh */}
      {node.type === 'reservoir' ? (
        // Elevated Storage Tank (Cylinder with conical top)
        <group>
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 1.0, 24]} />
            <meshStandardMaterial
              color={nodeColor}
              metalness={0.4}
              roughness={0.2}
              emissive={nodeColor}
              emissiveIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <coneGeometry args={[1.05, 0.6, 24]} />
            <meshStandardMaterial color="#6FBEB2" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      ) : node.type === 'zone' ? (
        // Village Supply Zone (Octahedral diamond)
        <mesh castShadow receiveShadow>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={nodeColor}
            metalness={0.3}
            roughness={0.4}
            emissive={nodeColor}
            emissiveIntensity={0.4}
          />
        </mesh>
      ) : (
        // Standard Pipe Junction (Sphere)
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[node.has_sensor ? 0.55 : 0.42, 20, 20]} />
          <meshStandardMaterial
            color={nodeColor}
            metalness={0.5}
            roughness={0.25}
            emissive={nodeColor}
            emissiveIntensity={node.has_sensor || candidate ? 0.5 : 0.2}
          />
        </mesh>
      )}

      {/* Selected Indicator Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[0.85, 1.0, 32]} />
          <meshBasicMaterial color="#A5E9DD" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* True Plume Spread Highlight (Teacher View) */}
      {isInTrueSpread && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.7, 0.9, 24]} />
          <meshBasicMaterial color="#FF5C5C" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Always-Readable High-Contrast Billboard Label (HTML overlay) */}
      {(showLabels || hovered || isSelected || candidate || isRecommended || isAlert) && (
        <Html
          position={[0, node.type === 'reservoir' ? 1.9 : 0.9, 0]}
          center
          distanceFactor={18}
          zIndexRange={[100, 0]}
        >
          <div
            className={`pointer-events-none select-none px-2 py-1 rounded-md text-xs font-mono font-bold whitespace-nowrap shadow-xl transition-all border ${
              isTrueSourceRevealed
                ? 'bg-[#FF5C5C] text-white border-white scale-110'
                : isAlert
                ? 'bg-[#FDF4AF] text-[#081416] border-[#34908B] scale-110 font-extrabold'
                : candidate
                ? 'bg-[#0F2226] text-[#A5E9DD] border-[#6FBEB2] scale-105'
                : isRecommended
                ? 'bg-[#34908B] text-[#FDF4AF] border-[#A5E9DD] animate-pulse'
                : isSelected
                ? 'bg-[#0F2226] text-[#A5E9DD] border-[#A5E9DD]'
                : 'bg-[#081416]/90 text-[#A5E9DD] border-[#6FBEB2]/40'
            }`}
          >
            <div className="flex items-center gap-1.5 leading-none">
              <span>{node.id}</span>
              {node.type === 'reservoir' && <span className="text-[9px] text-[#A5E9DD] font-sans">TANK</span>}
              {node.type === 'zone' && <span className="text-[9px] text-[#FDF4AF] font-sans">VILLAGE</span>}
            </div>

            {/* Candidate probability badge */}
            {candidate && (
              <div className="text-[10px] text-[#A5E9DD] font-bold mt-0.5">
                {(candidate.probability * 100).toFixed(0)}% likely
              </div>
            )}

            {/* Live sensor readout */}
            {reading && (
              <div
                className={`text-[9px] mt-0.5 ${
                  reading.is_alert ? 'text-[#FF5C5C] font-bold' : 'text-[#6FBEB2]'
                }`}
              >
                {reading.value.toFixed(0)} µS/cm
              </div>
            )}

            {/* Collected field sample readout */}
            {sampleVal !== undefined && (
              <div className="text-[9px] text-[#FDF4AF] font-bold mt-0.5">
                Sample: {sampleVal.toFixed(0)}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// Flowing Directional Pipe Edge with Pulsing Luminescence
// -------------------------------------------------------------
interface Edge3DProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  isAlarmed: boolean;
  isInSpread: boolean;
}

const Edge3D: React.FC<Edge3DProps> = ({
  startPos,
  endPos,
  isAlarmed,
  isInSpread,
}) => {
  const p1 = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
  const p2 = useMemo(() => new THREE.Vector3(...endPos), [endPos]);
  const distance = useMemo(() => p1.distanceTo(p2), [p1, p2]);
  const midPoint = useMemo(() => p1.clone().add(p2).multiplyScalar(0.5), [p1, p2]);

  // Cylinder orientation
  const orientation = useMemo(() => {
    const dir = p2.clone().sub(p1).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    return quat;
  }, [p1, p2]);

  const pulseMesh = useRef<THREE.Mesh>(null);

  // Animate flowing water pulse along edge
  useFrame(({ clock }) => {
    if (pulseMesh.current) {
      const t = (clock.getElapsedTime() * 0.45) % 1;
      const curPos = p1.clone().lerp(p2, t);
      pulseMesh.current.position.copy(curPos);
    }
  });

  const pipeColor = isAlarmed
    ? COLOR_YELLOW
    : isInSpread
    ? COLOR_CRIMSON
    : COLOR_LIGHT_CYAN;

  return (
    <group>
      {/* Outer Structural Pipe Cylinder */}
      <mesh position={midPoint} quaternion={orientation}>
        <cylinderGeometry args={[0.075, 0.075, distance, 12]} />
        <meshStandardMaterial
          color={isAlarmed ? '#FF5C5C' : '#1E474F'}
          roughness={0.3}
          metalness={0.6}
          emissive={isAlarmed ? '#FF5C5C' : '#34908B'}
          emissiveIntensity={isAlarmed ? 0.7 : 0.25}
        />
      </mesh>

      {/* Luminescent Flow Pulse */}
      <mesh ref={pulseMesh}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshBasicMaterial
          color={pipeColor}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Interactive 3D Control Center Viewport
// -------------------------------------------------------------
export const NetworkScene3D: React.FC = () => {
  const {
    network,
    simState,
    investigation,
    samplingRec,
    collectedSamples,
    revealResult,
    teacherView,
    inspectedNodeId,
    setInspectedNodeId,
  } = useApp();

  const [showLabels, setShowLabels] = useState(true);
  const [fps, setFps] = useState(60);
  const controlsRef = useRef<any>(null);

  // Cache node positions
  const nodePositions = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    if (!network?.nodes) return map;
    network.nodes.forEach(n => {
      map.set(n.id, to3D(n.x, n.y, n.elevation_m));
    });
    return map;
  }, [network]);

  // Lookup maps
  const latestReadingsMap = useMemo(() => {
    const map = new Map<string, { value: number; is_alert: boolean }>();
    if (!simState?.sensor_readings) return map;
    simState.sensor_readings.forEach(r => map.set(r.node_id, r));
    return map;
  }, [simState]);

  const candidatesMap = useMemo(() => {
    const map = new Map<string, { probability: number; rank: number }>();
    if (!investigation?.top_candidates) return map;
    investigation.top_candidates.forEach(c => map.set(c.node_id, c));
    return map;
  }, [investigation]);

  const trueSpreadSet = useMemo(() => {
    const set = new Set<string>();
    const spread = (simState as any)?.true_spread;
    if (Array.isArray(spread)) {
      spread.forEach((id: string) => set.add(id));
    }
    return set;
  }, [simState]);

  const recommendedNode = samplingRec?.recommended_node?.node_id;

  // Camera reset handler
  const resetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.2, 0);
    }
  }, []);

  // Double click node focuses camera
  const handleDoubleClick = useCallback((pos: [number, number, number]) => {
    if (controlsRef.current) {
      controlsRef.current.target.set(pos[0], pos[1], pos[2]);
    }
  }, []);

  return (
    <div className="w-full h-full relative select-none bg-[#081416] overflow-hidden">
      {/* 3D Top Status Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-[#0F2226]/90 border border-[#6FBEB2]/40 text-[#EAF7F5] text-xs font-mono flex items-center gap-2 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#A5E9DD] animate-pulse" />
          <span className="font-bold">SCADA 3D Network Twin</span>
        </div>
        <div className="px-2 py-1 rounded-md bg-[#081416]/80 border border-[#6FBEB2]/30 text-[#6FBEB2] text-[11px] font-mono backdrop-blur-md">
          {fps} FPS
        </div>
      </div>

      {/* Floating 3D Navigation Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowLabels(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xl backdrop-blur-md ${
            showLabels
              ? 'bg-[#34908B] text-[#EAF7F5] border-[#A5E9DD]'
              : 'bg-[#0F2226] text-[#A5E9DD] border-[#6FBEB2]/40 hover:bg-[#163238]'
          }`}
          title="Toggle 3D Node Labels"
        >
          <Layers size={13} />
          <span>{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
        </button>

        <button
          onClick={resetView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F2226] hover:bg-[#163238] text-[#EAF7F5] border border-[#6FBEB2]/50 text-xs font-semibold transition-all shadow-xl backdrop-blur-md"
          title="Reset Camera View"
        >
          <RotateCcw size={13} />
          <span>Reset camera</span>
        </button>
      </div>

      {/* Screen Reader Accessibility */}
      <div className="sr-only" aria-live="polite">
        3D view of the 42-node drinking water distribution network.
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 24, 30], fov: 42 }}
        dpr={Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(COLOR_BG);
        }}
      >
        <FpsMonitor onFps={setFps} />

        {/* Ambient & Spotlight for High-Contrast Technical Visibility */}
        <ambientLight intensity={0.9} color="#D2F6F0" />
        <directionalLight
          position={[20, 35, 25]}
          intensity={1.4}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-15, 20, -15]} intensity={0.8} color={COLOR_LIGHT_CYAN} />
        <fog attach="fog" args={[COLOR_BG, 45, 95]} />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 1.2, 0]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={8}
          maxDistance={65}
          enableDamping
          dampingFactor={0.08}
        />

        {/* Dark Obsidian Basemap */}
        <TechBasemap />

        {/* Flowing Water Pipes */}
        {network?.edges.map((edge: EdgeModel) => {
          const sPos = nodePositions.get(edge.from);
          const tPos = nodePositions.get(edge.to);
          if (!sPos || !tPos) return null;

          const sReading = latestReadingsMap.get(edge.from);
          const tReading = latestReadingsMap.get(edge.to);
          const isAlarmed = Boolean(sReading?.is_alert || tReading?.is_alert);
          const isInSpread = Boolean(teacherView && trueSpreadSet.has(edge.from) && trueSpreadSet.has(edge.to));

          return (
            <Edge3D
              key={edge.id}
              startPos={sPos}
              endPos={tPos}
              isAlarmed={isAlarmed}
              isInSpread={isInSpread}
            />
          );
        })}

        {/* 3D Network Nodes */}
        {network?.nodes.map((node: NodeModel) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const reading = latestReadingsMap.get(node.id);
          const candidate = candidatesMap.get(node.id);
          const isSampled = Boolean(collectedSamples[node.id]);
          const sampleVal = collectedSamples[node.id]?.reading;

          return (
            <Node3D
              key={node.id}
              node={node}
              position={pos}
              reading={reading}
              candidate={candidate}
              isRecommended={recommendedNode === node.id}
              isSampled={isSampled}
              sampleVal={sampleVal}
              isSelected={inspectedNodeId === node.id}
              isTrueSourceRevealed={Boolean(revealResult && revealResult.true_source === node.id)}
              isInTrueSpread={Boolean(teacherView && trueSpreadSet.has(node.id))}
              showLabels={showLabels}
              onClick={setInspectedNodeId}
              onDoubleClick={handleDoubleClick}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

// -------------------------------------------------------------
// Simple FPS Monitor inside Canvas frame loop
// -------------------------------------------------------------
const FpsMonitor: React.FC<{ onFps: (fps: number) => void }> = ({ onFps }) => {
  const frames = useRef(0);
  const prevTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const time = performance.now();
    if (time >= prevTime.current + 1000) {
      onFps(Math.round((frames.current * 1000) / (time - prevTime.current)));
      frames.current = 0;
      prevTime.current = time;
    }
  });

  return null;
};
