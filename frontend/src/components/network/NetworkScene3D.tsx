/**
 * NetworkScene3D.tsx — Complete SCADA Industrial Water Infrastructure Facility
 *
 * Faithfully re-creates the AquaTalk industrial SCADA monitoring interface
 * from the user reference image, adapted for the JALRAKSHAK AI contamination
 * investigation and source-localisation platform.
 *
 * Strict 6-colour design system:
 *   #1C3C53 — Primary dark structural background & foundation
 *   #446882 — Panels, structural surfaces & inactive infrastructure
 *   #08C4E1 — Primary interactive accent, glowing pipelines, active controls
 *   #0892C1 — Secondary technical accent, charts, indicators, borders
 *   #F8F3EF — High-readability foreground text, labels, telemetry values
 *   #F5E6BB — Attention & investigation accent, alerts, contamination highlights
 */

import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../state/appStore';
import type { NodeModel } from '../../api/types';
import {
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────────────────────
const C = {
  foundation: '#1C3C53',
  panel:      '#446882',
  flow:       '#08C4E1',
  tech:       '#0892C1',
  text:       '#F8F3EF',
  alert:      '#F5E6BB',
} as const;

const LabelsCtx = createContext<boolean>(false);

// ─────────────────────────────────────────────────────────────
// COORDINATE TRANSFORM (Maps network nodes to isometric plant)
// ─────────────────────────────────────────────────────────────
const toWorld = (x: number, y: number, elev: number = 220): [number, number, number] => {
  const wx = (x - 500) * 0.024;
  const wz = (y - 460) * 0.024;
  const wy = Math.max(0, (elev - 180) * 0.016);
  return [wx, wy, wz];
};

// ─────────────────────────────────────────────────────────────
// 3D PLATFORM: Dark foundation slab matching reference screenshot
// ─────────────────────────────────────────────────────────────
const PlantFoundation: React.FC = () => (
  <group position={[0, -0.5, 0]}>
    {/* Dark base platform */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
      <planeGeometry args={[36, 36]} />
      <meshStandardMaterial color={C.foundation} roughness={0.9} metalness={0.25} />
    </mesh>

    {/* Raised industrial curb / slab */}
    <mesh position={[0, -0.04, 0]}>
      <boxGeometry args={[32, 0.12, 32]} />
      <meshStandardMaterial color={C.panel} roughness={0.8} metalness={0.35} />
    </mesh>

    {/* Engineering coordinate grid */}
    <gridHelper
      args={[30, 30, C.flow, C.foundation]}
      position={[0, 0.03, 0]}
    />

    {/* Perimeter cyan glow trace */}
    <lineSegments position={[0, 0.04, 0]}>
      <edgesGeometry args={[new THREE.BoxGeometry(31.5, 0.02, 31.5)]} />
      <lineBasicMaterial color={C.flow} transparent opacity={0.35} />
    </lineSegments>
  </group>
);

// ─────────────────────────────────────────────────────────────
// 3D EQUIPMENT: Elevated Reservoir Clarifier Tank
// (Matches the large rectangular tank in the reference image)
// ─────────────────────────────────────────────────────────────
interface EqProps {
  node: NodeModel;
  worldPos: [number, number, number];
  isSelected: boolean;
  isAlert: boolean;
  hasReading: boolean;
  onClick: () => void;
}

const ReservoirClarifier: React.FC<EqProps> = ({
  node, worldPos, isSelected, isAlert, onClick,
}) => {
  const [hov, setHov] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);
  const showLabels = useContext(LabelsCtx);

  const [px, , pz] = worldPos;
  const bodyCol = isAlert ? C.alert : C.panel;
  const emissCol = isAlert ? C.alert : isSelected || hov ? C.flow : C.foundation;

  useFrame(({ clock }) => {
    if (glowRef.current && (isSelected || isAlert)) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 + Math.sin(clock.getElapsedTime() * 3) * 0.18;
    }
  });

  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHov(true); }}
      onPointerOut={() => setHov(false)}
    >
      {/* Structural columns */}
      {([-0.85, 0.85] as const).flatMap(lx =>
        ([-0.85, 0.85] as const).map((lz, i) => (
          <mesh key={`col-${lx}-${i}`} position={[lx, -0.25, lz]}>
            <cylinderGeometry args={[0.08, 0.08, 0.85, 8]} />
            <meshStandardMaterial color={C.tech} metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Main clarifier body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[2.2, 1.4, 2.2]} />
        <meshStandardMaterial
          color={bodyCol}
          emissive={emissCol}
          emissiveIntensity={isSelected || hov ? 0.45 : isAlert ? 0.6 : 0.1}
          metalness={0.55}
          roughness={0.25}
        />
      </mesh>

      {/* Walkway top border plate */}
      <mesh position={[0, 1.34, 0]}>
        <boxGeometry args={[2.3, 0.1, 2.3]} />
        <meshStandardMaterial color={C.tech} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Perimeter Catwalk Railings */}
      {([-1.05, 1.05] as const).flatMap(rx =>
        ([-1.05, 1.05] as const).map((rz, i) => (
          <mesh key={`rail-p-${rx}-${i}`} position={[rx, 1.68, rz]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color={C.tech} metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      )}
      {[[-1.05, 0], [1.05, 0], [0, -1.05], [0, 1.05]].map(([rx, rz], i) => (
        <mesh
          key={`bar-${i}`}
          position={[rx, 1.95, rz]}
          rotation={[0, rz !== 0 ? Math.PI / 2 : 0, 0]}
        >
          <boxGeometry args={[Math.abs(rz) > 0 ? 0.03 : 2.1, 0.03, Math.abs(rz) > 0 ? 2.1 : 0.03]} />
          <meshStandardMaterial color={C.tech} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Discharge outlet nozzle */}
      <mesh position={[1.15, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.35, 12]} />
        <meshStandardMaterial color={C.flow} emissive={C.flow} emissiveIntensity={0.6} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Selection halo */}
      {(isSelected || isAlert || hov) && (
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, 0]}>
          <ringGeometry args={[1.5, 1.9, 32]} />
          <meshBasicMaterial
            color={isAlert ? C.alert : C.flow}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 3D HUD label */}
      {(showLabels || hov || isSelected || isAlert) && (
        <Html position={[0, 2.4, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <div
            className={`pointer-events-none select-none px-2 py-0.5 rounded border text-[10px] font-mono font-bold whitespace-nowrap shadow-xl ${
              isAlert
                ? 'bg-[#1C3C53] text-[#F5E6BB] border-[#F5E6BB]'
                : isSelected || hov
                ? 'bg-[#1C3C53] text-[#08C4E1] border-[#08C4E1]'
                : 'bg-[#1C3C53]/95 text-[#F8F3EF] border-[#0892C1]/40'
            }`}
          >
            {node.id} • {node.label}
          </div>
        </Html>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D EQUIPMENT: Cylindrical Filtration Columns (Vertical Vessels)
// ─────────────────────────────────────────────────────────────
const FiltrationColumn: React.FC<EqProps> = ({
  node, worldPos, isSelected, isAlert, hasReading, onClick,
}) => {
  const [hov, setHov] = useState(false);
  const showLabels = useContext(LabelsCtx);
  const [px, , pz] = worldPos;

  const bodyCol = isAlert ? C.alert : C.panel;
  const emissCol = isAlert ? C.alert : isSelected || hov ? C.flow : C.foundation;

  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHov(true); }}
      onPointerOut={() => setHov(false)}
    >
      {/* Base mounting ring */}
      <mesh position={[0, -0.48, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 18]} />
        <meshStandardMaterial color={C.tech} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Vertical tank cylinder */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.4, 1.6, 22]} />
        <meshStandardMaterial
          color={bodyCol}
          emissive={emissCol}
          emissiveIntensity={isSelected || hov ? 0.45 : isAlert ? 0.6 : hasReading ? 0.25 : 0.08}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Dished top head */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.39, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={C.tech} metalness={0.75} roughness={0.2} />
      </mesh>

      {/* Flange bands */}
      {[-0.1, 0.5].map((y, i) => (
        <mesh key={`flange-${i}`} position={[0, y, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 0.06, 20]} />
          <meshStandardMaterial color={C.tech} metalness={0.85} roughness={0.15} />
        </mesh>
      ))}

      {/* Sensor nozzle indicator on top */}
      {node.has_sensor && (
        <mesh position={[0, 1.58, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
          <meshStandardMaterial color={C.flow} emissive={C.flow} emissiveIntensity={0.8} metalness={0.5} roughness={0.2} />
        </mesh>
      )}

      {/* Side pipe connection */}
      <mesh position={[0.45, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.25, 10]} />
        <meshStandardMaterial color={C.flow} emissive={C.flow} emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Selection halo */}
      {(isSelected || isAlert || hov) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[0.6, 0.85, 24]} />
          <meshBasicMaterial
            color={isAlert ? C.alert : C.flow}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {(showLabels || hov || isSelected || isAlert) && (
        <Html position={[0, 1.9, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <div
            className={`pointer-events-none select-none px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold whitespace-nowrap shadow-lg ${
              isAlert
                ? 'bg-[#1C3C53] text-[#F5E6BB] border-[#F5E6BB]'
                : isSelected || hov
                ? 'bg-[#1C3C53] text-[#08C4E1] border-[#08C4E1]'
                : 'bg-[#1C3C53]/90 text-[#F8F3EF] border-[#0892C1]/30'
            }`}
          >
            {node.id}{node.has_sensor ? ' [SENSOR]' : ''}
          </div>
        </Html>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D EQUIPMENT: Pump Unit (Motor Housing + Volute + Baseplate)
// ─────────────────────────────────────────────────────────────
const PumpUnit: React.FC<EqProps> = ({
  node, worldPos, isSelected, isAlert, hasReading, onClick,
}) => {
  const [hov, setHov] = useState(false);
  const showLabels = useContext(LabelsCtx);
  const [px, , pz] = worldPos;

  const pipeCol = isAlert ? C.alert : C.flow;
  const active = isSelected || isAlert || hasReading || hov;

  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHov(true); }}
      onPointerOut={() => setHov(false)}
    >
      {/* Structural skid baseplate */}
      <mesh position={[0, -0.47, 0]}>
        <boxGeometry args={[1.25, 0.08, 0.75]} />
        <meshStandardMaterial color={C.foundation} metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Pump volute (horizontal cylinder) */}
      <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 18]} />
        <meshStandardMaterial
          color={isAlert ? C.alert : C.panel}
          emissive={isAlert ? C.alert : isSelected || hov ? C.flow : C.foundation}
          emissiveIntensity={active ? 0.45 : 0.1}
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Electric motor casing */}
      <mesh position={[0.32, -0.16, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.42]} />
        <meshStandardMaterial
          color={C.tech}
          emissive={isSelected || hov ? C.flow : C.foundation}
          emissiveIntensity={isSelected || hov ? 0.3 : 0.05}
          metalness={0.75}
          roughness={0.2}
        />
      </mesh>

      {/* Motor cooling dome / fan cap */}
      <mesh position={[0.32, 0.12, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.14, 14]} />
        <meshStandardMaterial color={C.panel} metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Suction & Discharge pipes */}
      <mesh position={[-0.55, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.35, 10]} />
        <meshStandardMaterial color={pipeCol} emissive={pipeCol} emissiveIntensity={0.6} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[-0.05, -0.08, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.26, 10]} />
        <meshStandardMaterial color={pipeCol} emissive={pipeCol} emissiveIntensity={0.55} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Selection ring */}
      {(isSelected || isAlert || hov) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
          <ringGeometry args={[0.75, 1.0, 20]} />
          <meshBasicMaterial
            color={isAlert ? C.alert : C.flow}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {(showLabels || hov || isSelected || isAlert) && (
        <Html position={[0, 0.55, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <div
            className={`pointer-events-none select-none px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold whitespace-nowrap shadow-md ${
              isAlert
                ? 'bg-[#1C3C53] text-[#F5E6BB] border-[#F5E6BB]'
                : isSelected || hov
                ? 'bg-[#1C3C53] text-[#08C4E1] border-[#08C4E1]'
                : 'bg-[#1C3C53]/90 text-[#F8F3EF] border-[#0892C1]/30'
            }`}
          >
            {node.id} [PUMP]
          </div>
        </Html>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D EQUIPMENT: Village Supply Terminal (Zone Box)
// ─────────────────────────────────────────────────────────────
const VillageTerminal: React.FC<EqProps> = ({
  node, worldPos, isSelected, isAlert, onClick,
}) => {
  const [hov, setHov] = useState(false);
  const showLabels = useContext(LabelsCtx);
  const [px, , pz] = worldPos;

  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHov(true); }}
      onPointerOut={() => setHov(false)}
    >
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.55, 0.45, 0.55]} />
        <meshStandardMaterial
          color={isAlert ? C.alert : C.panel}
          emissive={isSelected || hov ? C.flow : isAlert ? C.alert : C.foundation}
          emissiveIntensity={isSelected || hov ? 0.4 : isAlert ? 0.55 : 0.08}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.62, 0.06, 0.62]} />
        <meshStandardMaterial color={C.tech} metalness={0.75} roughness={0.2} />
      </mesh>

      {(showLabels || hov || isSelected || isAlert) && (
        <Html position={[0, 0.35, 0]} center distanceFactor={20} zIndexRange={[100, 0]}>
          <div className="pointer-events-none select-none px-1 py-0.5 rounded border text-[8px] font-mono font-bold bg-[#1C3C53]/90 text-[#F5E6BB] border-[#0892C1]/30">
            {node.id}
          </div>
        </Html>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D GLOWING PIPES: Luminescent orthogonal conduits
// ─────────────────────────────────────────────────────────────
interface PipeProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  isAlert: boolean;
  isActive: boolean;
}

const GlowingPipeline: React.FC<PipeProps> = ({ start, end, isAlert, isActive }) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  const { midPt, len, quat } = useMemo(() => {
    const dir = end.clone().sub(start);
    const length = dir.length();
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    return { midPt: mid, len: length, quat: q };
  }, [start, end]);

  const pipeCol  = isAlert ? C.alert : C.panel;
  const glowCol  = isAlert ? C.alert : C.flow;

  useFrame(({ clock }) => {
    if (pulseRef.current && isActive) {
      const t = (clock.getElapsedTime() * 0.4) % 1;
      pulseRef.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <group>
      {/* Outer pipe casing */}
      <mesh position={midPt} quaternion={quat}>
        <cylinderGeometry args={[0.07, 0.07, len, 10]} />
        <meshStandardMaterial
          color={pipeCol}
          emissive={glowCol}
          emissiveIntensity={isAlert ? 0.6 : 0.3}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Inner illuminated core */}
      <mesh position={midPt} quaternion={quat}>
        <cylinderGeometry args={[0.035, 0.035, len, 8]} />
        <meshBasicMaterial color={glowCol} transparent opacity={0.65} />
      </mesh>
      {/* Animated flow particle */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color={glowCol} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// FACILITY THREE.JS SCENE CONTENT
// ─────────────────────────────────────────────────────────────
const PlantSceneContent: React.FC = () => {
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

  const posMap = useMemo(() => {
    const m = new Map<string, [number, number, number]>();
    network?.nodes.forEach(n => m.set(n.id, toWorld(n.x, n.y, n.elevation_m ?? 220)));
    return m;
  }, [network]);

  const alertSet = useMemo(() => {
    const s = new Set<string>();
    simState?.sensor_readings?.forEach(r => { if (r.is_alert) s.add(r.node_id); });
    investigation?.top_candidates?.forEach(c => s.add(c.node_id));
    const spread = (simState as any)?.true_spread;
    if (teacherView && Array.isArray(spread)) spread.forEach((id: string) => s.add(id));
    if (revealResult?.true_source) s.add(revealResult.true_source);
    if (samplingRec?.recommended_node?.node_id) s.add(samplingRec.recommended_node.node_id);
    return s;
  }, [simState, investigation, teacherView, revealResult, samplingRec]);

  const readingSet = useMemo(() => {
    const s = new Set<string>();
    simState?.sensor_readings?.forEach(r => s.add(r.node_id));
    Object.keys(collectedSamples || {}).forEach(id => s.add(id));
    return s;
  }, [simState, collectedSamples]);

  const handleClick = useCallback(
    (id: string) => setInspectedNodeId(inspectedNodeId === id ? null : id),
    [inspectedNodeId, setInspectedNodeId]
  );

  const classify = useCallback((n: NodeModel): 'reservoir' | 'vessel' | 'pump' | 'zone' => {
    if (n.type === 'reservoir') return 'reservoir';
    if (n.type === 'zone') return 'zone';
    const idx = parseInt(n.id.replace(/\D/g, '')) || 0;
    return (n.has_sensor || idx % 4 === 0) ? 'vessel' : 'pump';
  }, []);

  if (!network) return null;

  return (
    <>
      <PlantFoundation />

      {network.nodes.map(node => {
        const wPos = posMap.get(node.id);
        if (!wPos) return null;
        const props: EqProps = {
          node,
          worldPos: wPos,
          isSelected: inspectedNodeId === node.id,
          isAlert: alertSet.has(node.id),
          hasReading: readingSet.has(node.id),
          onClick: () => handleClick(node.id),
        };
        const type = classify(node);
        if (type === 'reservoir') return <ReservoirClarifier key={node.id} {...props} />;
        if (type === 'vessel')    return <FiltrationColumn key={node.id} {...props} />;
        if (type === 'zone')      return <VillageTerminal key={node.id} {...props} />;
        return <PumpUnit key={node.id} {...props} />;
      })}

      {network.edges.map(edge => {
        const sPos = posMap.get(edge.from);
        const ePos = posMap.get(edge.to);
        if (!sPos || !ePos) return null;
        const s = new THREE.Vector3(...sPos);
        const e = new THREE.Vector3(...ePos);
        const isAlert = alertSet.has(edge.from) || alertSet.has(edge.to);
        return (
          <GlowingPipeline
            key={edge.id}
            start={s}
            end={e}
            isAlert={isAlert}
            isActive={!!simState}
          />
        );
      })}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// CIRCULAR SVG GAUGE (Matches the reference screenshot dials)
// ─────────────────────────────────────────────────────────────
interface GaugeProps {
  value: number; // 0 - 100
  title: string;
  isAlert?: boolean;
}

const CircularScadaGauge: React.FC<GaugeProps> = ({ value, title, isAlert }) => {
  const radius = 46;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semi-circle sweep: 240 degrees (from 150deg to 390deg)
  const strokeDashoffset = circumference - (value / 100) * (circumference * 0.75);

  const strokeColor = isAlert ? C.alert : C.flow;

  return (
    <div className="relative flex flex-col items-center justify-center w-28 h-28">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-135">
        {/* Background track */}
        <circle
          stroke={C.foundation}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Active glowing indicator */}
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          style={{ strokeDashoffset, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {/* Centered value reading */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-xl font-mono font-bold text-[#F8F3EF] tracking-tight">
          {value.toFixed(1)}
        </span>
        <span className="text-[8px] font-mono text-[#0892C1] uppercase">
          {title}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SPARKLINE TELEMETRY GRAPH (PCC / PEE from reference screenshot)
// ─────────────────────────────────────────────────────────────
interface SparklineProps {
  title: string;
  data: number[];
  unit?: string;
}

const SparklineChart: React.FC<SparklineProps> = ({ title, data, unit = '' }) => {
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 140;
    const y = 38 - ((d - min) / range) * 32;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#446882]/70 border border-[#0892C1]/25 backdrop-blur-md">
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-[#F8F3EF] font-semibold">{title}</span>
        <span className="text-[#08C4E1] font-bold">{data[data.length - 1]} {unit}</span>
      </div>
      <div className="relative h-10 w-full overflow-hidden">
        <svg viewBox="0 0 140 40" className="w-full h-full overflow-visible">
          {/* Subtle horizontal grid lines */}
          <line x1="0" y1="10" x2="140" y2="10" stroke={C.foundation} strokeWidth="1" strokeDasharray="2 3" />
          <line x1="0" y1="25" x2="140" y2="25" stroke={C.foundation} strokeWidth="1" strokeDasharray="2 3" />
          {/* Sparkline curve */}
          <polyline
            fill="none"
            stroke={C.flow}
            strokeWidth="1.75"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Step vertical spikes */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 140;
            const y = 38 - ((d - min) / range) * 32;
            return (
              <line
                key={`spike-${i}`}
                x1={x}
                y1={38}
                x2={x}
                y2={y}
                stroke={C.flow}
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN SCADA MONITORING INTERFACE (NetworkScene3D)
// ─────────────────────────────────────────────────────────────
export const NetworkScene3D: React.FC = () => {
  const {
    network,
    simState,
    investigation,
    inspectedNodeId,
    setInspectedNodeId,
    findBestSample,
  } = useApp();

  const controlsRef = useRef<any>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<string>('1-2#');
  const [showHud, setShowHud] = useState(true);

  // Group status & alerts
  const isAlertG1 = Boolean(simState?.alert_count && simState.alert_count > 0);
  const isAlertG2 = Boolean(investigation?.top_candidates && investigation.top_candidates.length > 0);

  const resetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
    }
  }, []);

  // Equipment selection list (mapped to real network nodes)
  const equipmentUnits = [
    { id: '1-1#', label: 'R1 Lift Pump', nodeId: 'R1', hz: 284, m3: 1820, bar: 6.8 },
    { id: '1-2#', label: 'J-01 Booster', nodeId: 'J-01', hz: 356, m3: 2533, bar: 7.2 },
    { id: '1-3#', label: 'J-02 Sensor Stn', nodeId: 'J-02', hz: 310, m3: 2100, bar: 6.9 },
    { id: '2-1#', label: 'R2 Gravity Feed', nodeId: 'R2', hz: 240, m3: 1650, bar: 5.5 },
    { id: '2-2#', label: 'J-04 Secondary', nodeId: 'J-04', hz: 295, m3: 1980, bar: 6.1 },
    { id: '2-3#', label: 'J-06 East Sensor', nodeId: 'J-06', hz: 330, m3: 2240, bar: 6.4 },
  ];

  return (
    <LabelsCtx.Provider value={showLabels}>
      <div className="w-full h-full relative select-none overflow-hidden bg-[#1C3C53]">

        {/* ── 3D CANVAS (BACKGROUND DIGITAL INFRASTRUCTURE PLANT) ── */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [14, 11, 14], fov: 42, near: 0.1, far: 250 }}
            shadows
            style={{ background: '#1C3C53' }}
            gl={{ antialias: true, alpha: false }}
          >
            <ambientLight intensity={0.4} color={C.tech} />
            <directionalLight
              position={[12, 24, 12]}
              intensity={1.15}
              color={C.text}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[0, 6, 0]} intensity={0.8} color={C.flow} distance={24} />
            <pointLight position={[-8, 4, -8]} intensity={0.4} color={C.tech} distance={18} />
            <pointLight position={[8, 4, 8]} intensity={0.4} color={C.flow} distance={18} />

            <OrbitControls
              ref={controlsRef}
              target={[0, 0, 0]}
              minDistance={5}
              maxDistance={45}
              minPolarAngle={Math.PI / 8}
              maxPolarAngle={Math.PI / 2.1}
              enableDamping
              dampingFactor={0.06}
            />

            <PlantSceneContent />
          </Canvas>
        </div>

        {/* ── TOP SCADA STATUS BAR ── */}
        <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          {/* Brand header */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#446882]/85 border border-[#08C4E1]/35 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#08C4E1] animate-pulse" />
            <span className="font-heading font-bold text-xs text-[#F5E6BB] tracking-wide">
              JALRAKSHAK AI — SCADA Facility
            </span>
            <span className="text-xs text-[#0892C1]">•</span>
            <span className="text-[11px] font-mono text-[#F8F3EF]">
              {network?.nodes.length || 42} Junctions / {simState?.current_step || 0} Steps
            </span>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHud(p => !p)}
              className="px-2.5 py-1.5 rounded-lg bg-[#446882]/85 border border-[#0892C1]/30 text-xs font-mono font-semibold text-[#F8F3EF] hover:border-[#08C4E1] transition-all backdrop-blur-md shadow-md"
            >
              {showHud ? 'Hide HUD' : 'Show HUD'}
            </button>
            <button
              onClick={() => setShowLabels(p => !p)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all backdrop-blur-md shadow-md ${
                showLabels
                  ? 'bg-[#08C4E1]/20 text-[#08C4E1] border-[#08C4E1]'
                  : 'bg-[#446882]/85 text-[#F8F3EF] border-[#0892C1]/30'
              }`}
            >
              <Layers size={12} />
              <span>{showLabels ? 'Labels ON' : 'Labels OFF'}</span>
            </button>
            <button
              onClick={resetCamera}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#446882]/85 border border-[#0892C1]/30 text-xs font-mono font-semibold text-[#F8F3EF] hover:border-[#08C4E1] transition-all backdrop-blur-md shadow-md"
              title="Reset Isometric Camera"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ── OVERLAY HUD PANELS (FAITHFUL TO REFERENCE IMAGE) ── */}
        {showHud && (
          <div className="absolute inset-0 pointer-events-none p-3 pt-12 flex flex-col justify-between z-10 overflow-hidden">

            {/* TOP ROW: Left Group Panels & Right Sparklines/Equipment */}
            <div className="flex items-start justify-between w-full gap-4">

              {/* LEFT HUD: Group 1# & Group 2# SCADA Metric Cards */}
              <div className="flex flex-col gap-2.5 w-80 max-w-[48%] pointer-events-auto">

                {/* GROUP 1# CARD */}
                <div className="p-3 rounded-xl bg-[#446882]/85 border border-[#08C4E1]/30 backdrop-blur-md shadow-2xl space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#0892C1]/20">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs text-[#F8F3EF]">Group 1#</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#1C3C53] text-[#08C4E1] border border-[#08C4E1]/30">
                        Pre Mode
                      </span>
                      {isAlertG1 ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/40 animate-pulse font-bold">
                          Issue
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#08C4E1]/20 text-[#08C4E1]">
                          Safe
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#0892C1]">Remote Control</span>
                  </div>

                  {/* Gauge + Metrics row */}
                  <div className="flex items-center justify-between gap-2">
                    <CircularScadaGauge value={72.6} title="Efficiency (%)" isAlert={isAlertG1} />
                    <div className="flex flex-col gap-1 text-[10px] font-mono">
                      <div>
                        <span className="text-[#0892C1] block text-[9px]">Frequency</span>
                        <strong className="text-xs text-[#F8F3EF]">82 HZ</strong>
                      </div>
                      <div>
                        <span className="text-[#0892C1] block text-[9px]">Volume</span>
                        <strong className="text-xs text-[#F8F3EF]">567.1 m³/h</strong>
                      </div>
                      <div>
                        <span className="text-[#0892C1] block text-[9px]">Pressure</span>
                        <strong className="text-xs text-[#08C4E1]">15 mPa</strong>
                      </div>
                    </div>
                  </div>

                  {/* Optimization sub-card */}
                  <div className="p-2 rounded-lg bg-[#1C3C53]/70 border border-[#08C4E1]/20 flex items-center justify-between text-[10px] font-mono">
                    <div>
                      <span className="text-[#08C4E1] font-semibold flex items-center gap-1">
                        <span>↑ Optimization</span>
                      </span>
                      <strong className="text-xs text-[#F8F3EF]">91.3% <span className="text-[#08C4E1] text-[9px]">↑ 12.7%</span></strong>
                    </div>
                    <div className="text-right text-[9px] text-[#0892C1]">
                      <div>Freq: 128 HZ</div>
                      <div>Vol: 864.2 m³/h</div>
                    </div>
                  </div>
                </div>

                {/* GROUP 2# CARD */}
                <div className="p-3 rounded-xl bg-[#446882]/85 border border-[#08C4E1]/30 backdrop-blur-md shadow-2xl space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#0892C1]/20">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs text-[#F8F3EF]">Group 2#</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#1C3C53] text-[#08C4E1] border border-[#08C4E1]/30">
                        Pre Mode
                      </span>
                      {isAlertG2 ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#F5E6BB]/20 text-[#F5E6BB] border border-[#F5E6BB]/40 font-bold">
                          Warning
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#08C4E1]/20 text-[#08C4E1]">
                          Safe
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#0892C1]">Remote Control</span>
                  </div>

                  {/* Gauge + Metrics row */}
                  <div className="flex items-center justify-between gap-2">
                    <CircularScadaGauge value={82.6} title="Efficiency (%)" isAlert={isAlertG2} />
                    <div className="flex flex-col gap-1 text-[10px] font-mono">
                      <div>
                        <span className="text-[#0892C1] block text-[9px]">Frequency</span>
                        <strong className="text-xs text-[#F8F3EF]">91 HZ</strong>
                      </div>
                      <div>
                        <span className="text-[#0892C1] block text-[9px]">Volume</span>
                        <strong className="text-xs text-[#F8F3EF]">634.7 m³/h</strong>
                      </div>
                      <div>
                        <span className="text-[#0892C1] block text-[9px]">Pressure</span>
                        <strong className="text-xs text-[#08C4E1]">8.6 mPa</strong>
                      </div>
                    </div>
                  </div>

                  {/* Optimization sub-card */}
                  <div className="p-2 rounded-lg bg-[#1C3C53]/70 border border-[#08C4E1]/20 flex items-center justify-between text-[10px] font-mono">
                    <div>
                      <span className="text-[#08C4E1] font-semibold flex items-center gap-1">
                        <span>↑ Optimization</span>
                      </span>
                      <strong className="text-xs text-[#F8F3EF]">88.3% <span className="text-[#08C4E1] text-[9px]">↑ 1.06%</span></strong>
                    </div>
                    <div className="text-right text-[9px] text-[#0892C1]">
                      <div>Freq: 128 HZ</div>
                      <div>Vol: 723.6 m³/h</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT HUD: Telemetry Sparklines + Equipment Accordions */}
              <div className="flex flex-col gap-2.5 w-80 max-w-[48%] pointer-events-auto">

                {/* Monthly PCC & Monthly PEE Sparklines */}
                <div className="grid grid-cols-2 gap-2">
                  <SparklineChart
                    title="Monthly PCC"
                    data={[45, 60, 52, 78, 62, 55, 48, 42, 38]}
                  />
                  <SparklineChart
                    title="Monthly PEE"
                    data={[55, 72, 60, 85, 68, 62, 70, 75, 72]}
                  />
                </div>

                {/* Equipment Unit List */}
                <div className="p-2.5 rounded-xl bg-[#446882]/85 border border-[#08C4E1]/30 backdrop-blur-md shadow-2xl space-y-1.5 max-h-[380px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-1 border-b border-[#0892C1]/20 text-[10px] font-mono font-bold text-[#F8F3EF]">
                    <span>EQUIPMENT UNITS</span>
                    <span className="text-[#0892C1]">TELEMETRY</span>
                  </div>

                  {equipmentUnits.map(unit => {
                    const isExpanded = expandedUnit === unit.id;
                    const isSelected = inspectedNodeId === unit.nodeId;

                    return (
                      <div
                        key={unit.id}
                        className={`rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#1C3C53] border-[#08C4E1] shadow-md shadow-[#08C4E1]/20'
                            : 'bg-[#1C3C53]/50 border-[#0892C1]/20 hover:border-[#08C4E1]/40'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setExpandedUnit(isExpanded ? '' : unit.id);
                            setInspectedNodeId(unit.nodeId);
                          }}
                          className="w-full flex items-center justify-between p-2 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#08C4E1]" />
                            <span className="text-xs font-mono font-bold text-[#F8F3EF]">
                              {unit.id} {unit.label}
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp size={12} className="text-[#08C4E1]" /> : <ChevronDown size={12} className="text-[#0892C1]" />}
                        </button>

                        {/* Expanded details (Faithful to screenshot) */}
                        {isExpanded && (
                          <div className="px-3 pb-2.5 pt-1 border-t border-[#0892C1]/15 text-[10px] font-mono space-y-1 text-[#F8F3EF]">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                              <div>Frequency: <strong className="text-[#F5E6BB]">{unit.hz} Hz</strong></div>
                              <div>Volume: <strong className="text-[#08C4E1]">{unit.m3} m³/h</strong></div>
                              <div>Head: <strong>6.5 m</strong></div>
                              <div>Power: <strong>342 kW</strong></div>
                              <div>Efficiency: <strong>65%</strong></div>
                              <div>Rotation: <strong>1462 RPM</strong></div>
                              <div>Duty Time: <strong>231 h</strong></div>
                              <div>Inlet: <strong>{unit.bar} Bar</strong></div>
                              <div>Outlet: <strong>{(unit.bar + 0.1).toFixed(1)} Bar</strong></div>
                            </div>
                            <div className="pt-1.5 flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectedNodeId(unit.nodeId);
                                  findBestSample();
                                }}
                                className="flex-1 py-1 rounded bg-[#08C4E1] text-[#1C3C53] font-bold text-[10px] text-center"
                              >
                                Sample Node
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* BOTTOM ROW: Comparison Chart, Duty Timeline & Distribution Petals */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 pointer-events-auto pt-2">

              {/* BOTTOM-LEFT: Efficiency Comparison Chart */}
              <div className="p-2.5 rounded-xl bg-[#446882]/85 border border-[#08C4E1]/30 backdrop-blur-md shadow-2xl space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#F8F3EF]">
                  <span>Efficiency Comparison (%)</span>
                  <div className="flex items-center gap-2 text-[8px]">
                    <span className="text-[#08C4E1]">■ Group 1#</span>
                    <span className="text-[#F5E6BB]">■ Predict</span>
                  </div>
                </div>
                <div className="h-16 w-full">
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="0" y1="15" x2="200" y2="15" stroke={C.foundation} strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="35" x2="200" y2="35" stroke={C.foundation} strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="55" x2="200" y2="55" stroke={C.foundation} strokeWidth="1" />
                    {/* Smooth curve 1 */}
                    <path
                      d="M 5,52 Q 70,50 120,40 T 195,12"
                      fill="none"
                      stroke={C.flow}
                      strokeWidth="2"
                    />
                    {/* Smooth curve 2 (Predict) */}
                    <path
                      d="M 5,54 Q 70,52 120,44 T 195,18"
                      fill="none"
                      stroke={C.alert}
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>
              </div>

              {/* BOTTOM-CENTER: Duty Actual And Recommend (Gantt Schedule) */}
              <div className="p-2.5 rounded-xl bg-[#446882]/85 border border-[#08C4E1]/30 backdrop-blur-md shadow-2xl space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#F8F3EF]">
                  <span>Duty Actual And Recommend</span>
                  <div className="flex items-center gap-2 text-[8px]">
                    <span className="text-[#08C4E1]">■ Actual</span>
                    <span className="text-[#F5E6BB]">■ Recommend</span>
                  </div>
                </div>
                <div className="space-y-1 text-[9px] font-mono text-[#0892C1]">
                  {['1-1#', '1-2#', '1-3#', '2-1#', '2-2#'].map((id, idx) => (
                    <div key={id} className="flex items-center gap-2">
                      <span className="w-6 shrink-0">{id}</span>
                      <div className="flex-1 h-2 rounded bg-[#1C3C53] relative overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            marginLeft: `${idx * 16}%`,
                            width: `${30 + idx * 8}%`,
                            backgroundColor: idx === 1 ? C.alert : C.flow,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM-RIGHT: Power Distribution & Volume Distribution Petal Rose Charts */}
              <div className="p-2.5 rounded-xl bg-[#446882]/85 border border-[#08C4E1]/30 backdrop-blur-md shadow-2xl space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#F8F3EF]">
                  <span>Power Distribution</span>
                  <span>Volume Distribution</span>
                </div>
                <div className="flex items-center justify-around h-16">
                  {/* Radial Petal 1 */}
                  <svg viewBox="0 0 60 60" className="w-16 h-16">
                    <circle cx="30" cy="30" r="8" fill={C.foundation} />
                    <circle cx="30" cy="18" r="6" fill={C.flow} fillOpacity="0.8" />
                    <circle cx="40" cy="24" r="7" fill={C.tech} fillOpacity="0.7" />
                    <circle cx="38" cy="38" r="6" fill={C.alert} fillOpacity="0.75" />
                    <circle cx="22" cy="38" r="8" fill={C.flow} fillOpacity="0.85" />
                    <circle cx="18" cy="24" r="5" fill={C.tech} fillOpacity="0.6" />
                  </svg>
                  {/* Radial Petal 2 */}
                  <svg viewBox="0 0 60 60" className="w-16 h-16">
                    <circle cx="30" cy="30" r="8" fill={C.foundation} />
                    <circle cx="30" cy="16" r="7" fill={C.flow} fillOpacity="0.9" />
                    <circle cx="42" cy="26" r="5" fill={C.alert} fillOpacity="0.7" />
                    <circle cx="36" cy="40" r="8" fill={C.tech} fillOpacity="0.8" />
                    <circle cx="20" cy="36" r="6" fill={C.flow} fillOpacity="0.75" />
                    <circle cx="18" cy="22" r="7" fill={C.tech} fillOpacity="0.8" />
                  </svg>
                </div>
                {/* Sector selectors */}
                <div className="flex items-center justify-center gap-1 text-[8px] font-mono pt-0.5">
                  {['1-1#', '1-2#', '1-3#', '2-1#', '2-2#', '2-3#'].map(u => (
                    <button
                      key={u}
                      onClick={() => setExpandedUnit(u)}
                      className={`px-1 py-0.5 rounded border ${
                        expandedUnit === u
                          ? 'bg-[#08C4E1] text-[#1C3C53] font-bold border-[#08C4E1]'
                          : 'bg-[#1C3C53] text-[#F8F3EF] border-[#0892C1]/30'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </LabelsCtx.Provider>
  );
};
