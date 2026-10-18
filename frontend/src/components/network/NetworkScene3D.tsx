/**
 * NetworkScene3D.tsx - Real-time 3D drinking-water network simulation view.
 * 
 * Built with Three.js via @react-three/fiber and @react-three/drei.
 * Reads exclusively from the central appStore (zero duplicate logic, zero fake state).
 * 
 * Terrain elevation function:
 *   cosmeticElevation(x, z) = smooth falloff from high northern reservoirs (Z < 0)
 *   down into southern village valleys (Z > 0), calibrated so reservoirs naturally sit
 *   on elevated hills matching the network's hydraulic head.
 */

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../state/appStore';
import type { NodeModel, EdgeModel } from '../../api/types';
import { RotateCcw } from 'lucide-react';

// Palette constants strictly matching brand tokens
const COLOR_BLUE = '#425B9A';
const COLOR_SKY = '#76C0EC';
const COLOR_OLIVE = '#597928';
const COLOR_SAGE = '#91AC67';
const COLOR_AMBER = '#E8A33D';
const COLOR_RED = '#D9534F';
const COLOR_MUTED = '#4F6182';

// World coordinate mapping:
// Centers 2D (x: 100-890, y: 80-840) to origin and maps elevation_m (186-340) to vertical Y
const to3D = (x: number, y: number, elev: number = 220): [number, number, number] => {
  const wx = (x - 500) * 0.045;
  const wz = (y - 460) * 0.045;
  // Elevation scaled so highest reservoir is ~4.5 units high, lowest zone is ~0.8 units
  const wy = Math.max(0.6, (elev - 180) * 0.024);
  return [wx, wy, wz];
};

// -------------------------------------------------------------
// Procedural Terrain Ground
// -------------------------------------------------------------
const Terrain: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Ground plane with gentle natural contours reflecting northern high ground
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 48, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); // PlaneGeometry lies in XY initially
      // Cosmetic elevation function: northern slope + subtle undulation
      const northSlope = (-z + 20) * 0.08;
      const ripple = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 0.35;
      pos.setZ(i, Math.max(0, northSlope + ripple));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.2, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={COLOR_OLIVE}
        roughness={0.92}
        metalness={0.05}
        wireframe={false}
      />
    </mesh>
  );
};

// -------------------------------------------------------------
// Interactive Node Object (Reservoir, Junction, Sensor, Village)
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
  onClick,
  onDoubleClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Derive honest observed state color
  const stateColor = useMemo(() => {
    if (isTrueSourceRevealed) {
      return COLOR_RED;
    }
    if (isSampled) {
      return (sampleVal || 0) > 230 ? COLOR_RED : COLOR_SAGE;
    }
    if (reading) {
      return reading.is_alert ? (reading.value > 350 ? COLOR_RED : COLOR_AMBER) : COLOR_SKY;
    }
    return COLOR_MUTED;
  }, [reading, isSampled, sampleVal, isTrueSourceRevealed]);

  // Subtle pulsing animation for candidate or recommended node
  useFrame(({ clock }) => {
    if (ringRef.current && (candidate || isRecommended)) {
      const t = clock.getElapsedTime();
      const s = 1 + Math.sin(t * 3) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      ref={meshRef}
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
      {/* 1. Node Geometry depending on node type */}
      {node.type === 'reservoir' ? (
        // Reservoir: Distinct elevated cylinder with sky water surface
        <group>
          <mesh castShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.9, 1.0, 0.8, 20]} />
            <meshStandardMaterial color={COLOR_BLUE} roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.85, 20]} />
            <meshStandardMaterial color={COLOR_SKY} emissive={COLOR_SKY} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ) : node.type === 'zone' ? (
        // Village Supply Zone: House shape with Sage/Olive tint
        <group position={[0, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color={stateColor === COLOR_MUTED ? COLOR_SAGE : stateColor} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.7, 0.45, 4]} />
            <meshStandardMaterial color={COLOR_OLIVE} />
          </mesh>
        </group>
      ) : (
        // Junction / Sensor Node: Sphere with distinct ring if sensor
        <group position={[0, 0.25, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[node.has_sensor ? 0.35 : 0.24, 16, 16]} />
            <meshStandardMaterial
              color={stateColor}
              emissive={stateColor}
              emissiveIntensity={reading?.is_alert ? 0.8 : hovered ? 0.4 : 0.15}
            />
          </mesh>

          {/* Sensor Ring & Antenna */}
          {node.has_sensor && (
            <group>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.48, 0.04, 8, 24]} />
                <meshStandardMaterial color={reading?.is_alert ? COLOR_AMBER : COLOR_SKY} />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
                <meshStandardMaterial color="#EAF1F8" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* 2. Floating Candidate Probability Ring & Badge */}
      {candidate && (
        <group position={[0, 0.9, 0]}>
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.05, 8, 24]} />
            <meshStandardMaterial
              color={candidate.rank === 1 ? COLOR_SKY : COLOR_BLUE}
              emissive={COLOR_SKY}
              emissiveIntensity={0.6}
            />
          </mesh>
          <Html position={[0, 0.4, 0]} center distanceFactor={14}>
            <div className="px-1.5 py-0.5 rounded bg-[#152248]/90 border border-[#76C0EC]/60 text-[#76C0EC] font-mono text-[10px] font-bold shadow-md whitespace-nowrap pointer-events-none">
              {(candidate.probability * 100).toFixed(1)}%
            </div>
          </Html>
        </group>
      )}

      {/* 3. Optimal Sample Target Light Beam */}
      {isRecommended && (
        <group position={[0, 1.6, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.3, 2.5, 12]} />
            <meshBasicMaterial color={COLOR_SKY} transparent opacity={0.65} />
          </mesh>
          <Html position={[0, 1.4, 0]} center distanceFactor={14}>
            <div className="px-2 py-0.5 rounded-full bg-[#76C0EC] text-[#121D38] font-bold text-[10px] shadow-lg whitespace-nowrap pointer-events-none">
              Optimal sample
            </div>
          </Html>
        </group>
      )}

      {/* 4. Selection Highlight Ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.95, 24]} />
          <meshBasicMaterial color={COLOR_SKY} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 5. Teacher View: expanding true spread glow */}
      {isInTrueSpread && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.9, 24]} />
          <meshBasicMaterial color={COLOR_RED} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 6. Hover Tooltip Card */}
      {hovered && (
        <Html position={[0, 1.1, 0]} center distanceFactor={12}>
          <div className="p-2 rounded-lg bg-[#0E1733]/95 border border-[#425B9A] shadow-xl text-xs text-[#EAF1F8] whitespace-nowrap pointer-events-none backdrop-blur-sm z-50">
            <div className="font-semibold text-[#76C0EC]">{node.label}</div>
            <div className="text-[10px] text-[#9FB0C9]">
              ID: <span className="font-mono text-[#EAF1F8]">{node.id}</span> • Elev:{' '}
              <span className="font-mono">{node.elevation_m}m</span>
            </div>
            {reading && (
              <div className="text-[11px] font-mono mt-0.5 text-white">
                Reading: {reading.value.toFixed(1)} µS/cm {reading.is_alert && '(Elevated)'}
              </div>
            )}
            {node.type === 'zone' && (
              <div className="text-[10px] text-[#91AC67]">
                {node.households} households
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Village Household count tag */}
      {node.type === 'zone' && !hovered && (
        <Html position={[0, 1.2, 0]} center distanceFactor={16}>
          <div className="px-1.5 py-0.5 rounded bg-[#152248]/85 border border-[#91AC67]/40 text-[#91AC67] font-mono text-[9px] pointer-events-none shadow-sm whitespace-nowrap">
            {node.households} hh
          </div>
        </Html>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// Realistic Flowing Water Pipe (Edge with Flowing Particles)
// -------------------------------------------------------------
interface Edge3DProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  isAlarmed: boolean;
  isInSpread: boolean;
}

const Edge3D: React.FC<Edge3DProps> = ({ startPos, endPos, isAlarmed, isInSpread }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  const startV = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
  const endV = useMemo(() => new THREE.Vector3(...endPos), [endPos]);

  // Cylinder pipe curve
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

  // Animate flowing particle along pipe
  useFrame(({ clock }) => {
    if (particleRef.current) {
      const t = (clock.getElapsedTime() * 0.4) % 1;
      const pt = curve.getPoint(t);
      particleRef.current.position.copy(pt);
    }
  });

  const pipeColor = isAlarmed ? COLOR_AMBER : isInSpread ? COLOR_RED : COLOR_SKY;

  return (
    <group>
      {/* Outer pipe cylinder */}
      <mesh position={midPos} quaternion={orientation}>
        <cylinderGeometry args={[0.07, 0.07, length, 8]} />
        <meshStandardMaterial
          color={pipeColor}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Water flow particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
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
// Main 3D Canvas Controller & Scene Manager
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

  // Compute node 3D positions
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

  // Smooth double-click fly-to node
  const handleDoubleClick = useCallback((pos: [number, number, number]) => {
    if (controlsRef.current) {
      controlsRef.current.target.set(pos[0], pos[1], pos[2]);
    }
  }, []);

  // Reset view to default perspective
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.5, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0E1733] rounded-xl overflow-hidden border border-[#425B9A]/30 select-none">
      {/* 3D Scene Controls & Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-[#152248]/85 border border-[#425B9A]/40 text-[11px] font-mono text-[#9FB0C9] backdrop-blur-sm">
          3D Hydraulic View
        </div>
        <div className="px-2 py-0.5 rounded-md bg-[#152248]/85 border border-[#425B9A]/40 text-[10px] font-mono text-[#76C0EC] backdrop-blur-sm">
          {fps} fps
        </div>
      </div>

      {/* Floating View Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={resetView}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#152248]/90 hover:bg-[#1E2F62] text-[#76C0EC] border border-[#425B9A]/40 text-xs font-medium transition-colors shadow-sm backdrop-blur-sm"
          title="Reset Camera View"
        >
          <RotateCcw size={13} />
          <span>Reset camera</span>
        </button>
      </div>

      {/* Screen reader summary accessibility */}
      <div className="sr-only" aria-live="polite">
        3D view of the 42-node water distribution network. Use orbit controls to rotate,
        scroll to zoom. Current step is {simState?.current_step || 0}. Alerts count:{' '}
        {simState?.alert_count || 0}.
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 26, 32], fov: 45 }}
        dpr={Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0E1733');
        }}
      >
        <FpsMonitor onFps={setFps} />

        {/* Environment Lights & Fog */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[15, 30, 20]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 15, -10]} intensity={0.4} color={COLOR_SKY} />
        <fog attach="fog" args={['#0E1733', 35, 80]} />

        {/* Orbit Controls with bounded limits */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 1.5, 0]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={60}
          enableDamping
          dampingFactor={0.08}
        />

        {/* Procedural Terrain */}
        <Terrain />

        {/* Network Edges (Pipes with Flow) */}
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

        {/* Network Nodes */}
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
              onClick={setInspectedNodeId}
              onDoubleClick={handleDoubleClick}
            />
          );
        })}
      </Canvas>
    </div>
  );
};
