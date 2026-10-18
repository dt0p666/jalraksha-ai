import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../../api/client';
import type { HistogramResponse } from '../../api/types';
import { Database, Info } from 'lucide-react';

const COLUMN_DESCRIPTIONS: Record<string, string> = {
  'CONDUCTIVITY (umhos/cm)': 'Electrical conductivity measuring dissolved mineral salts and ionic contamination.',
  'PH': 'Hydrogen-ion potential indicating acidity or alkalinity. Normal potable range is 6.5 - 8.5.',
  'D.O. (mg/l)': 'Dissolved Oxygen essential for aquatic health; rapid drops indicate high organic waste.',
  'B.O.D. (mg/l)': 'Biochemical Oxygen Demand measuring oxygen consumed by bacteria decomposing organic matter.',
  'Temp': 'Water temperature in Celsius affecting reaction kinetics and biological growth rates.',
  'NITRATENAN N+ NITRITENANN (mg/l)': 'Total nitrate and nitrite nitrogen from fertilizer run-off and sewage intrusion.',
};

export const DatasetExplorer: React.FC = () => {
  const [column, setColumn] = useState<string>('CONDUCTIVITY (umhos/cm)');
  const bins = 15;
  const [data, setData] = useState<HistogramResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.getDatasetProfile()
      .then(p => setProfile(p))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getHistogram(column, bins)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [column, bins]);

  const availableColumns = Object.keys(COLUMN_DESCRIPTIONS);

  return (
    <div className="p-6 bg-[#446882] border border-[#08C4E1]/25 rounded-2xl text-[#F8F3EF] shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#08C4E1]/15">
        <div>
          <div className="flex items-center gap-2">
            <Database size={18} className="text-[#08C4E1]" />
            <h3 className="font-heading font-bold text-base text-[#F8F3EF]">
              Empirical Baseline Distribution
            </h3>
          </div>
          <span className="text-xs text-[#F8F3EF] mt-0.5 block">
            Observed distribution of {profile?.summary?.total_rows || 1991} water quality monitoring records
          </span>
        </div>

        {/* Dropdown column selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="col-select" className="text-xs text-[#F8F3EF]">Parameter:</label>
          <select
            id="col-select"
            value={column}
            onChange={e => setColumn(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#1C3C53] border border-[#08C4E1]/30 text-xs font-mono text-[#08C4E1] focus:outline-none"
          >
            {availableColumns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Parameter Explanation description */}
      <div className="p-3 bg-[#1C3C53] rounded-xl border border-[#08C4E1]/20 flex items-start gap-2.5 text-xs text-[#F8F3EF]">
        <Info size={16} className="text-[#08C4E1] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F8F3EF]">{column}: </strong>
          <span>{COLUMN_DESCRIPTIONS[column] || 'Water quality monitoring station parameter.'}</span>
        </div>
      </div>

      {/* Recharts Bar Histogram */}
      <div className="w-full h-64 font-mono text-[10px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs text-[#F8F3EF]">
            Loading empirical distribution...
          </div>
        ) : !data || data.bins.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#F8F3EF]">
            No histogram data available for this column.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.bins.map(b => ({
                range: `${b.bin_start.toFixed(0)}-${b.bin_end.toFixed(0)}`,
                count: b.count,
              }))}
              margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(8, 196, 225, 0.1)" />
              <XAxis dataKey="range" stroke="#F8F3EF" angle={-25} textAnchor="end" interval={0} />
              <YAxis stroke="#F8F3EF" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C3C53',
                  border: '1px solid rgba(8, 196, 225, 0.4)',
                  borderRadius: '8px',
                  color: '#F8F3EF',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="count" fill="#08C4E1" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dataset Provenance Note */}
      <div className="text-[11px] text-[#F8F3EF]/80 pt-2 border-t border-[#08C4E1]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>Water quality monitoring network calibration dataset.</span>
        <span>Sensor noise σ: 15.0 • Clean baseline: 183.0 µS/cm</span>
      </div>
    </div>
  );
};
