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
    <div className="p-5 bg-[#141E3D] border border-[#425B9A]/30 rounded-xl text-[#EAF1F8] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#425B9A]/30">
        <div>
          <div className="flex items-center gap-2">
            <Database size={18} className="text-[#76C0EC]" />
            <h3 className="font-serif font-bold text-base text-[#EAF1F8]">
              What Normal Water Looks Like
            </h3>
          </div>
          <span className="text-xs text-[#9FB0C9] mt-0.5 block">
            Empirical distribution of {profile?.rows || 1991} water quality monitoring records
          </span>
        </div>

        {/* Dropdown column selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="col-select" className="text-xs text-[#9FB0C9]">Parameter:</label>
          <select
            id="col-select"
            value={column}
            onChange={e => setColumn(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0D1630] border border-[#425B9A]/40 text-xs font-mono text-[#76C0EC] focus:outline-none"
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
      <div className="p-3 bg-[#0D1630] rounded-lg border border-[#425B9A]/20 flex items-start gap-2.5 text-xs text-[#9FB0C9]">
        <Info size={16} className="text-[#76C0EC] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#EAF1F8]">{column}: </strong>
          <span>{COLUMN_DESCRIPTIONS[column] || 'Water quality monitoring station parameter.'}</span>
        </div>
      </div>

      {/* Recharts Bar Histogram */}
      <div className="w-full h-64 font-mono text-[10px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs text-[#9FB0C9]">
            Loading empirical distribution...
          </div>
        ) : !data || data.bins.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#9FB0C9]">
            No histogram data available for this column.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.bins.map(b => ({
                range: `${b.bin_start}-${b.bin_end}`,
                count: b.count,
              }))}
              margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#425B9A" strokeOpacity={0.25} />
              <XAxis dataKey="range" stroke="#9FB0C9" angle={-25} textAnchor="end" interval={0} />
              <YAxis stroke="#9FB0C9" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141E3D',
                  border: '1px solid rgba(118, 192, 236, 0.4)',
                  borderRadius: '8px',
                  color: '#EAF1F8',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="count" fill="#425B9A" stroke="#76C0EC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dataset Provenance Note */}
      <div className="text-[11px] text-[#9FB0C9]/80 pt-2 border-t border-[#425B9A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>User-provided dataset (Indian CPCB Water Quality Monitoring Network format).</span>
        <span>Sensor noise sigma: 15.0 • Baseline: 183.0 umhos/cm</span>
      </div>
    </div>
  );
};
