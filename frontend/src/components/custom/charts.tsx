import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

// Theme Colors using tailwind design system palette & semantic colors
const COLOR_WINE = 'var(--primary, #9B30FF)';
const COLOR_TAUPE = '#8D7B75';
const COLOR_PINK = '#FF5C80';
const COLOR_NAVY = '#1E2B45';

// 1. DONUT CHART (Receita por Tipo de Sala)
export const DonutsChartPlaceholder: React.FC = () => {
  const data = [
    { name: 'IMAX', value: 48, color: '#9B30FF', change: '+8.1%', isPos: true },
    { name: '4DC', value: 28, color: '#8D7B75', change: '-0%', isPos: null },
    { name: 'VIP', value: 15, color: '#FF5C80', change: '-8.1%', isPos: false },
    { name: 'Std', value: 9, color: '#1E2B45', change: '-8.1%', isPos: false },
  ];

  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  return (
    <div className="p-5 border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] text-foreground">
      <div className="mb-4">
        <h3 className="text-base font-extrabold tracking-tight uppercase">Receita por Tipo de Sala</h3>
        <span className="text-xs font-bold text-foreground/60">% do faturamento total</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Recharts Donut */}
        <div className="w-36 h-36 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={36}
                outerRadius={62}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                onMouseEnter={(_, index) => setHoveredSlice(data[index].name)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="var(--background)"
                    strokeWidth={hoveredSlice === entry.name ? 5 : 3}
                    className="transition-all cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-background border-2 border-foreground p-2 text-xs font-black text-foreground shadow-[3px_3px_0px_0px_var(--border)]">
                        <span className="block text-primary font-extrabold">{item.name}</span>
                        <span>Faturamento: {item.value}%</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Figma Legend List */}
        <div className="flex-1 space-y-2.5 w-full">
          {data.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredSlice(item.name)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`flex items-center justify-between text-xs font-bold p-1 transition-colors ${
                hoveredSlice === item.name ? 'bg-foreground/10' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-extrabold text-foreground">{item.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-black text-foreground">{item.value}%</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black ${
                    item.isPos === true
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500'
                      : item.isPos === false
                      ? 'bg-destructive/20 text-destructive border border-destructive'
                      : 'bg-foreground/10 text-foreground/60 border border-foreground/30'
                  }`}
                >
                  {item.isPos === true ? `↑ ${item.change}` : item.isPos === false ? `↓ ${item.change}` : item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. LINE CHART (Receita Diária)
export const LineChartPlaceholder: React.FC = () => {
  const lineData = [
    { day: 'Seg', valor: 2.8 },
    { day: 'Ter', valor: 4.1 },
    { day: 'Qua', valor: 2.7 },
    { day: 'Qui', valor: 3.1 },
    { day: 'Sex', valor: 1.5 },
    { day: 'Sab', valor: 4.7 },
    { day: 'Dom', valor: 2.9 },
  ];

  return (
    <div className="p-5 border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] text-foreground">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold tracking-tight uppercase">Receita Diária</h3>
          <span className="text-xs font-bold text-foreground/60">Semana 25–31 mar · R$48.3k total</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="border-2 border-emerald-600 bg-emerald-500/10 px-2 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
            ↑ +12%
          </span>
          <button className="flex items-center gap-1 text-xs font-extrabold text-foreground/60 hover:underline cursor-pointer">
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="day" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="currentColor"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}k`}
              domain={[0, 5]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border-2 border-foreground p-2 text-xs font-black text-primary shadow-[3px_3px_0px_0px_var(--border)]">
                      {`${label}: R$ ${payload[0].value}k`}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#9B30FF"
              strokeWidth={3}
              dot={{ r: 5, fill: '#9B30FF', stroke: 'var(--background)', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#FF5C80' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 3. BAR CHART (Ingressos Vendidos)
export const BarChartPlaceholder: React.FC = () => {
  const barData = [
    { day: 'Seg', ingressos: 150 },
    { day: 'Ter', ingressos: 380 },
    { day: 'Qua', ingressos: 240 },
    { day: 'Qui', ingressos: 190 },
    { day: 'Sex', ingressos: 160 },
    { day: 'Sab', ingressos: 380 },
    { day: 'Dom', ingressos: 150 },
  ];

  return (
    <div className="p-5 border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] text-foreground">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold tracking-tight uppercase">Ingressos Vendidos</h3>
          <span className="text-xs font-bold text-foreground/60">3.412 na semana por dia</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="border-2 border-emerald-600 bg-emerald-500/10 px-2 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
            ↑ +8.1%
          </span>
          <button className="flex items-center gap-1 text-xs font-extrabold text-foreground/60 hover:underline cursor-pointer">
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="day" stroke="currentColor" fontSize={11} tickLine={false} axisLine={{ stroke: 'currentColor', strokeWidth: 2 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border-2 border-foreground p-2 text-xs font-black text-primary shadow-[3px_3px_0px_0px_var(--border)]">
                      {`${label}: ${payload[0].value} ingressos`}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="ingressos" fill="#9B30FF" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Value Sub-Labels matching Figma */}
      <div className="grid grid-cols-7 text-center pt-1 text-[11px] font-black text-foreground">
        {barData.map((d, i) => (
          <span key={i}>{d.ingressos}</span>
        ))}
      </div>
    </div>
  );
};

// 4. SCATTERPLOT (Receita por Tipo de Sala / Quadrantes)
export const ScatterplotPlaceholder: React.FC = () => {
  const [activePoint, setActivePoint] = useState<any | null>(null);

  const points = [
    { x: 15, y: 75, name: 'Sessão 2D Standard', color: '#1E2B45', size: 6, room: 'Std' },
    { x: 22, y: 70, name: 'Sessão VIP Prime', color: '#FF5C80', size: 10, room: 'VIP' },
    { x: 30, y: 78, name: 'Sessão 3D IMAX', color: '#1E2B45', size: 12, room: 'IMAX' },
    { x: 35, y: 72, name: 'Sessão 4DX Special', color: '#FF5C80', size: 8, room: '4DC' },
    { x: 68, y: 20, name: 'Alien: Romulus', color: '#FF5C80', size: 9, label: 'Alien: Romulus', room: 'VIP' },
    { x: 73, y: 40, name: 'Alien: Romulus (IMAX)', color: '#1E2B45', size: 12, label: 'Alien: Romulus', room: 'IMAX' },
    { x: 88, y: 65, name: 'Duna: Parte II', color: '#FF5C80', size: 11, label: 'Duna:Parte II', room: 'VIP' },
    { x: 91, y: 68, name: 'Duna: Parte II (4DX)', color: '#FF5C80', size: 10, room: '4DC' },
    { x: 42, y: 45, name: 'Sessão Regular', color: '#1E2B45', size: 10, room: 'Std' },
    { x: 58, y: 44, name: 'Sessão Matinê', color: '#FF5C80', size: 7, room: 'VIP' },
  ];

  return (
    <div className="p-5 border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] text-foreground overflow-hidden">
      <div className="mb-4">
        <h3 className="text-base font-extrabold tracking-tight uppercase">Receita por Tipo de Sala</h3>
        <span className="text-xs font-bold text-foreground/60">% do faturamento total</span>
      </div>

      <div className="mx-6 h-48 relative border-l-2 border-b-2 border-foreground/40">
        {/* Y Axis Labels */}
        <span className="absolute -left-7 top-1 text-[10px] font-bold text-foreground/60">Alto</span>
        <span className="absolute -left-9 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground/60">Médio</span>
        <span className="absolute -left-8 bottom-1 text-[10px] font-bold text-foreground/60">Baixo</span>

        {/* Quadrant Lines */}
        <div className="absolute top-0 bottom-0 left-1/2 border-r border-foreground/20" />
        <div className="absolute left-0 right-0 top-1/2 border-b border-foreground/20" />

        {/* Points */}
        {points.map((pt, i) => (
          <div
            key={i}
            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            onMouseEnter={() => setActivePoint(pt)}
            onMouseLeave={() => setActivePoint(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
          >
            <div
              style={{ width: `${pt.size * 1.4}px`, height: `${pt.size * 1.4}px`, backgroundColor: pt.color }}
              className="rounded-full transition-transform group-hover:scale-150 shadow-sm"
            />
            {pt.label && (
              <span
                className={`absolute -top-4 -left-6 text-[9px] font-black tracking-tight whitespace-nowrap pointer-events-none ${
                  pt.color === '#1E2B45' ? 'text-foreground' : 'text-primary'
                }`}
              >
                {pt.label}
              </span>
            )}

            {/* Interactive Tooltip Card */}
            {activePoint?.name === pt.name && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-background border-2 border-foreground p-2 text-xs font-black text-foreground shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in zoom-in-95 pointer-events-none">
                <span className="block text-primary">{pt.name}</span>
                <span className="block text-[10px] text-foreground/60">Faturamento: {pt.x}% • Tipo: {pt.room}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* X Axis Labels */}
      <div className="mx-6 flex justify-between text-[10px] font-bold text-foreground/60 pt-1">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

// 5. HEATMAP (Heatmap de Ocupação)
export const HeatmapPlaceholder: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; time: string; pct: string } | null>(null);

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const times = ['13h - 14h', '15h - 16h', '17h - 18h', '19h - 20h', '21h - 22h'];

  const getCellBg = (dayIndex: number, timeIndex: number) => {
    if (dayIndex === 2 && timeIndex === 0) return { bg: 'bg-foreground/20', text: 'text-foreground/60', label: '-', pct: '0%' };
    if (dayIndex === 6 && timeIndex === 3) return { bg: 'bg-destructive', text: 'text-white', label: '100%', pct: '100%' };
    if (dayIndex >= 5) return { bg: 'bg-destructive/80', text: 'text-white', label: '+12%', pct: '85%' };
    if (timeIndex >= 3) return { bg: 'bg-amber-500', text: 'text-background', label: '+12%', pct: '70%' };
    if (timeIndex === 2) return { bg: 'bg-emerald-600', text: 'text-white', label: '+12%', pct: '50%' };
    return { bg: 'bg-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', label: '+12%', pct: '30%' };
  };

  return (
    <div className="p-5 border-4 border-foreground/40 bg-background font-display shadow-[6px_6px_0px_0px_var(--border)] text-foreground relative">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold tracking-tight uppercase">Heatmap de Ocupação</h3>
          <span className="text-xs font-bold text-foreground/60">Dia da semana × Faixa de horário</span>
        </div>

        {hoveredCell && (
          <div className="bg-background border-2 border-foreground px-2.5 py-1 text-xs font-black text-primary shadow-[2px_2px_0px_0px_var(--border)]">
            {hoveredCell.day} ({hoveredCell.time}): {hoveredCell.pct} ocupação
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1.5 text-center">
          <thead>
            <tr>
              <th className="w-12"></th>
              {times.map((t, idx) => (
                <th key={idx} className="text-xs font-bold text-foreground/60 pb-2">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dIdx) => (
              <tr key={dIdx}>
                <td className="text-xs font-extrabold text-foreground/60 pr-2 text-left">{day}</td>
                {times.map((tLabel, tIdx) => {
                  const cell = getCellBg(dIdx, tIdx);
                  return (
                    <td key={tIdx}>
                      <div
                        onMouseEnter={() => setHoveredCell({ day, time: tLabel, pct: cell.pct })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-8 flex items-center justify-center font-extrabold text-xs rounded-none cursor-pointer transition-transform hover:scale-105 ${cell.bg} ${cell.text}`}
                      >
                        {cell.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-foreground/60 pt-4 mt-2 border-t border-foreground/20">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-foreground/20" />
          <span>Nenhuma</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-emerald-500/30" />
          <span>&lt;40%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-emerald-600" />
          <span>40-60%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-amber-500" />
          <span>60-80%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-destructive/80" />
          <span>80-95%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-destructive" />
          <span>Lotada</span>
        </div>
      </div>
    </div>
  );
};
