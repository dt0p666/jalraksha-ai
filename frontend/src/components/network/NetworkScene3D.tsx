/**
 * NetworkScene3D.tsx - High-readability 3D drinking-water network digital twin.
 *
 * Modeled after modern industrial water dispatch control rooms:
 * - High-contrast dark obsidian basemap with crisp grid coordinates
 * - Vibrant neon water glow (#A5E9DD) along high-pressure trunk pipes
 * - Flowing luminescent water pulses indicating real directional velocity
 * - Sharp billboard 3D badges with node ID, sensor telemetry, and village labels
 * - High-contrast alert indicators using the custom palette:
 *     #FDF4AF (Solar Light) - Sensor alerts, optimal sampling beacon, key highlights
 *     #A5E9DD (Aquamarine)  - Healthy flowing drinking water, telemetry glow
 *     #6FBEB2 (Medium Teal) - Sub-sector junctions, branch pipelines
 *     #34908B (Deep Teal)   - Storage tanks (R1, R2), core distribution trunks
 *     #FF5C5C (Crimson)     - Verified contamination alarms
 */

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../state/appStore';
import type { NodeModel, EdgeModel } from '../../api/types';
import { RotateCcw, Layers } from 'lucide-react';

// Custom 4-color palette tokens
const COLOR_YELLOW = '#FDF4AF';    // Solar highlight & telemetry alert
const COLOR_AQUAMARINE = '#A5E9DD';// Clean flowing water glow
const COLOR_TEAL = '#6FBEB2';      // Junctions & secondary branch pipes
const COLOR_DEEP_TEAL = '#34908B'; // Elevated reservoirs & primary trunk
const COLOR_CRIMSON = '#FF5C5C';   // Contamination confirmed
const COLOR_MUTED = '#4A6B70';     // Inactive / unmeasured network nodes
const COLOR_BG = '#060B12';        // Obsidian deep navy basemap

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
          color="#060C14"
          roughness={0.95}
          metalness={0.2}
        />
      </mesh>

      {/* Grid coordinate helper */}
      <gridHelper
        args={[80, 40, '#15333A', '#0D1E24']}
        position={[0, 0.01, 0]}
      />

      {/* Subtle outer tech boundaries */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[36, 36.3, 64]} />
        <meshBasicMaterial color="#1E474F" transparent opacity={0.35} />
      </mesh>
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
    if (reading || isSampled) return COLOR_AQUAMARINE;
    if (node.type === 'zone') return COLOR_TEAL;
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
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* 1. Node Physical Mesh */}
      {node.type === 'reservoir' ? (
        // Reservoir: Distinct high-head storage tank with illuminated water surface
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.1, 1.2, 1.0, 24]} />
            <meshStandardMaterial
              color={COLOR_DEEP_TEAL}
              roughness={0.25}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.05, 24]} />
            <meshStandardMaterial
              color={COLOR_AQUAMARINE}
              emissive={COLOR_AQUAMARINE}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ) : node.type === 'zone' ? (
        // Village Zone: Architectural cluster with pitched roof
        <group position={[0, 0.45, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 0.8, 1.0]} />
            <meshStandardMaterial
              color={isAlert ? COLOR_YELLOW : COLOR_TEAL}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.9, 0.55, 4]} />
            <meshStandardMaterial color="#16383B" />
          </mesh>
        </group>
      ) : (
        // Junction / Sensor Node: Glowing sphere
        <group position={[0, 0.35, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[node.has_sensor ? 0.42 : 0.3, 20, 20]} />
            <meshStandardMaterial
              color={nodeColor}
              emissive={nodeColor}
              emissiveIntensity={isAlert ? 1.0 : node.has_sensor ? 0.7 : hovered ? 0.5 : 0.25}
              roughness={0.2}
            />
          </mesh>

          {/* Glowing pulse ring around active sensors */}
          {node.has_sensor && (
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.62, 0.05, 12, 32]} />
              <meshBasicMaterial
                color={isAlert ? COLOR_YELLOW : COLOR_AQUAMARINE}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </group>
      )}

      {/* 2. Permanent High-Readability Badge */}
      {showLabels && (
        <Html
          position={[0, node.type === 'reservoir' ? 1.6 : 1.1, 0]}
          center
          distanceFactor={18}
          zIndexRange={[100, 0]}
        >
          <div
            className={`px-2 py-0.5 rounded flex items-center gap-1.5 font-mono text-[11px] font-bold shadow-lg transition-all border whitespace-nowrap pointer-events-none ${
              isAlert
                ? 'bg-[#1D1705] text-[#FDF4AF] border-[#FDF4AF] ring-2 ring-[#FDF4AF]/30 animate-pulse'
                : node.type === 'reservoir'
                ? 'bg-[#061A19] text-[#A5E9DD] border-[#34908B]'
                : node.type === 'zone'
                ? 'bg-[#061719] text-[#6FBEB2] border-[#6FBEB2]/60'
                : node.has_sensor
                ? 'bg-[#09151C] text-[#A5E9DD] border-[#A5E9DD]/60'
                : 'bg-[#080E18]/90 text-[#7E9EB0] border-[#1C363D]'
            }`}
          >
            <span>{node.id}</span>
            {reading && (
              <span className="text-[10px] opacity-90">
                {Math.round(reading.value)} µS
              </span>
            )}
            {node.type === 'zone' && (
              <span className="text-[10px] text-[#A5E9DD]">
                {node.households} hh
              </span>
            )}
          </div>
        </Html>
      )}

      {/* 3. Candidate Probability Floating Beacon */}
      {candidate && (
        <Html position={[0, 2.2, 0]} center distanceFactor={16}>
          <div className="px-2 py-1 rounded bg-[#07191C] border-2 border-[#A5E9DD] text-[#A5E9DD] font-mono text-[11px] font-black shadow-2xl flex items-center gap-1 whitespace-nowrap pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#A5E9DD] animate-ping" />
            <span>{(candidate.probability * 100).toFixed(1)}% probable</span>
          </div>
        </Html>
      )}

      {/* 4. Optimal Sample Target Light Beam */}
      {isRecommended && (
        <group position={[0, 2.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.45, 4.0, 16]} />
            <meshBasicMaterial color={COLOR_YELLOW} transparent opacity={0.7} />
          </mesh>
          <Html position={[0, 2.4, 0]} center distanceFactor={16}>
            <div className="px-2.5 py-1 rounded-full bg-[#FDF4AF] text-[#081216] font-bold text-[11px] shadow-xl uppercase tracking-wider whitespace-nowrap pointer-events-none">
              ★ Recommended sample
            </div>
          </Html>
        </group>
      )}

      {/* 5. Selection Ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.15, 32]} />
          <meshBasicMaterial color={COLOR_YELLOW} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 6. True Spread Highlight (Ground Truth) */}
      {isInTrueSpread && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 1.1, 32]} />
          <meshBasicMaterial color={COLOR_CRIMSON} transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 7. Hover Detailed HUD Card */}
      {hovered && (
        <Html position={[0, 1.6, 0]} center distanceFactor={12} zIndexRange={[200, 0]}>
          <div className="p-3 rounded-lg bg-[#08121A]/95 border border-[#A5E9DD] shadow-2xl text-xs text-[#E8F8F5] whitespace-nowrap pointer-events-none backdrop-blur-md min-w-[180px]">
            <div className="font-bold text-[#A5E9DD] text-sm flex items-center justify-between pb-1 border-b border-[#1A3840]">
              <span>{node.label}</span>
              <span className="font-mono text-[10px] text-[#7E9EB0]">{node.id}</span>
            </div>
            <div className="mt-1.5 space-y-1 text-[11px]">
              <div className="flex justify-between text-[#7E9EB0]">
                <span>Elevation:</span>
                <span className="font-mono text-[#E8F8F5]">{node.elevation_m} meters</span>
              </div>
              <div className="flex justify-between text-[#7E9EB0]">
                <span>Type:</span>
                <span className="capitalize text-[#E8F8F5]">{node.type}</span>
              </div>
              {reading && (
                <div className="mt-1 pt-1 border-t border-[#1A3840] flex justify-between font-mono">
                  <span className="text-[#7E9EB0]">Conductivity:</span>
                  <span className={`font-bold ${reading.is_alert ? 'text-[#FDF4AF]' : 'text-[#A5E9DD]'}`}>
                    {reading.value.toFixed(1)} µS/cm
                  </span>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// Realistic Water Pipe with Glowing Particle Motion
// -------------------------------------------------------------
interface Edge3DProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  isAlarmed: boolean;
  isInSpread: boolean;
}

const Edge3D: React.FC<Edge3DProps> = ({ startPos, endPos, isAlarmed, isInSpread }) => {
  const particle1Ref = useRef<THREE.Mesh>(null);
  const particle2Ref = useRef<THREE.Mesh>(null);

  const startV = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
  const endV = useMemo(() => new THREE.Vector3(...endPos), [endPos]);

  const { curve, midPos, length, orientation } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(endV, startV);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(startV, endV).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    const cur = new THREE.LineCurve3(startV, endV);
    return { curve: cur, midPos: mid, length: len, orientation: quat };
  }, [startV, endV]);

  // Flowing particles along the line
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.45;
    if (particle1Ref.current) {
      particle1Ref.current.position.copy(curve.getPoint(t % 1));
    }
    if (particle2Ref.current) {
      particle2Ref.current.position.copy(curve.getPoint((t + 0.5) % 1));
    }
  });

  const pipeColor = isAlarmed
    ? COLOR_YELLOW
    : isInSpread
    ? COLOR_CRIMSON
    : COLOR_AQUAMARINE;

  return (
    <group>
      {/* Pipe cylinder */}
      <mesh position={midPos} quaternion={orientation}>
        <cylinderGeometry args={[0.08, 0.08, length, 12]} />
        <meshStandardMaterial
          color={pipeColor}
          roughness={0.2}
          metalness={0.3}
          emissive={pipeColor}
          emissiveIntensity={isAlarmed ? 0.7 : 0.4}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Water flow particle pulses */}
      <mesh ref={particle1Ref}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh ref={particle2Ref}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={COLOR_YELLOW} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Frame Rate Monitor inside Canvas
// -------------------------------------------------------------
const FpsMonitor: React.FC<{ onFps: (f: number) => void }> = ({ onFps }) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      onFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
};

// -------------------------------------------------------------
// Main 3D Simulation Canvas
// -------------------------------------------------------------
export const NetworkScene3D: React.FC = () => {
  const {
    network,
    simState,
    investigation,
    recommendedNode,
    collectedSamples,
    revealResult,
    teacherView,
    inspectedNodeId,
    setInspectedNodeId,
  } = useApp();

  const controlsRef = useRef<any>(null);
  const [fps, setFps] = useState<number>(60);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Compute 3D node positions
  const nodePositions = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    if (!network?.nodes) return map;
    for (const n of network.nodes) {
      map.set(n.id, to3D(n.x, n.y, n.elevation_m));
    }
    return map;
  }, [network]);

  const latestReadingsMap = useMemo(() => {
    return new Map(simState?.sensor_readings.map(r => [r.node_id, r]) || []);
  }, [simState]);

  const candidatesMap = useMemo(() => {
    return new Map(investigation?.top_candidates.map(c => [c.node_id, c]) || []);
  }, [investigation]);

  const trueSpreadSet = useMemo(() => {
    return new Set(revealResult?.true_spread_nodes || []);
  }, [revealResult]);

  const handleDoubleClick = useCallback((pos: [number, number, number]) => {
    if (controlsRef.current) {
      controlsRef.current.target.set(pos[0], pos[1], pos[2]);
    }
  }, []);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.2, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[540px] bg-[#060B12] rounded-xl overflow-hidden border border-[#1E474F]/50 select-none">
      {/* Control Room Top Overlay Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-3 py-1 rounded bg-[#09141D]/90 border border-[#34908B]/60 text-xs font-mono text-[#A5E9DD] backdrop-blur-md flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#A5E9DD] animate-pulse" />
          <span>SCADA 3D Network Twin</span>
        </div>
        <div className="px-2.5 py-1 rounded bg-[#09141D]/90 border border-[#1E474F] text-[11px] font-mono text-[#7E9EB0] backdrop-blur-md">
          {fps} FPS
        </div>
      </div>

      {/* Action Buttons Top Right */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={() => setShowLabels(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded bg-[#09141D]/90 text-xs font-medium border transition-colors shadow-lg backdrop-blur-md ${
            showLabels
              ? 'text-[#A5E9DD] border-[#34908B]/70 hover:bg-[#122A30]'
              : 'text-[#7E9EB0] border-[#1E474F] hover:bg-[#122A30]'
          }`}
          title="Toggle Billboard Labels"
        >
          <Layers size={13} />
          <span>{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
        </button>

        <button
          onClick={resetView}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#09141D]/90 hover:bg-[#122A30] text-[#A5E9DD] border border-[#34908B]/70 text-xs font-medium transition-colors shadow-lg backdrop-blur-md"
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

        {/* Ambient & Spotlight for Crisp High-Contrast Technical Visibility */}
        <ambientLight intensity={0.9} color="#D2F6F0" />
        <directionalLight
          position={[20, 35, 25]}
          intensity={1.4}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-15, 20, -15]} intensity={0.8} color={COLOR_AQUAMARINE} />
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
