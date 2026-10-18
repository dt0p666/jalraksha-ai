import React, { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from 'recharts';
import { api } from '../../api/client';
import { useApp } from '../../state/appStore';
import type { ObservationModel } from '../../api/types';

const SENSOR_COLORS: Record<string, string> = {
  'J-02': '#A5E9DD', // Aquamarine
  'J-05': '#FDF4AF', // Solar Yellow
  'J-08': '#6FBEB2', // Medium Teal
  'J-11': '#FF5C5C', // Crimson Alert
  'J-15': '#34908B', // Deep Marine Teal
  'J-17': '#84D6C7', // Light Cyan
  'J-24': '#FEEFA0', // Pale Amber
  'J-26': '#4BA39E', // Bright Teal
};

export const SensorChart: React.FC = () => {
  const { simState } = useApp();
  const [observations, setObservations] = useState<ObservationModel[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string>('all');

  const currentStep = simState?.current_step || 0;

  useEffect(() => {
    api.getSensorObservations()
      .then(res => setObservations(res.observations))
      .catch(() => {});
  }, [currentStep]);

  // Aggregate observations into step-indexed table for Recharts
  const chartData = useMemo(() => {
    const stepMap = new Map<number, Record<string, number | string>>();

    observations.forEach(o => {
      if (!o.is_sensor) return;
      if (!stepMap.has(o.step)) {
        stepMap.set(o.step, { step: o.step });
      }
      const entry = stepMap.get(o.step)!;
      entry[o.node_id] = o.value;
    });

    const rows = Array.from(stepMap.values()).sort(
      (a, b) => Number(a.step) - Number(b.step)
    );
    return rows;
  }, [observations]);

  const activeSensors = Object.keys(SENSOR_COLORS);

  return (
    <div className="p-4 bg-[#152248] border border-[#425B9A]/30 rounded-xl text-[#EAF1F8] shadow-sm space-y-3">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#425B9A]/30">
        <div>
          <h3 className="font-serif font-bold text-sm text-[#EAF1F8]">
            Sensor readings over time
          </h3>
          <span className="text-[11px] text-[#9FB0C9]">
            Sensors measure conductivity (µS/cm) across 8 pipeline monitoring points
          </span>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sensor-filter" className="text-xs text-[#9FB0C9]">Focus:</label>
          <select
            id="sensor-filter"
            value={selectedSensor}
            onChange={e => setSelectedSensor(e.target.value)}
            className="px-2.5 py-1 rounded bg-[#0D1630] border border-[#425B9A]/40 text-xs font-mono text-[#76C0EC] focus:outline-none"
          >
            <option value="all">All 8 Sensors</option>
            {activeSensors.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recharts LineChart */}
      <div className="w-full h-56 font-mono text-[10px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#9FB0C9] text-xs font-sans">
            Awaiting telemetry sensor observations...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#425B9A" strokeOpacity={0.25} />
              <XAxis dataKey="step" stroke="#9FB0C9" tickLine={false} />
              <YAxis domain={[140, 'auto']} stroke="#9FB0C9" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141E3D',
                  border: '1px solid rgba(118, 192, 236, 0.4)',
                  borderRadius: '8px',
                  color: '#EAF1F8',
                  fontSize: '11px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
                iconType="circle"
              />

              {/* Alert threshold reference line */}
              <ReferenceLine
                y={230.0}
                stroke="#D9534F"
                strokeDasharray="4 4"
                label={{
                  value: 'Alert Threshold (230)',
                  fill: '#D9534F',
                  fontSize: 10,
                  position: 'top',
                }}
              />

              {activeSensors
                .filter(s => selectedSensor === 'all' || selectedSensor === s)
                .map(s => (
                  <Line
                    key={s}
                    type="monotone"
                    dataKey={s}
                    name={s}
                    stroke={SENSOR_COLORS[s]}
                    strokeWidth={selectedSensor === s ? 2.5 : 1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
